"""Voice WebSocket and REST endpoints with tools and multilingual pipeline."""

import base64
import json
import logging
import time
from typing import Optional, Dict, List

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import SessionLocal, get_db
from app.middleware.api_key_validator import require_api_key, validate_ws_api_key
from app.models.apikey import APIKey
from app.services.brain_service import brain_service
from app.services.key_service import log_usage
from app.services.stt_service import stt_service
from app.services.tts_service import tts_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/voice", tags=["voice"])

class SpeakRequest(BaseModel):
    text: str
    language: str = "en"

class TranscribeResponse(BaseModel):
    text: str
    language: str
    confidence: float

class SpeakResponse(BaseModel):
    audio_base64: str
    sample_rate: int

# In-memory session history for websockets
SESSION_HISTORY: Dict[str, List[Dict[str, str]]] = {}

@router.websocket("/ws")
async def voice_websocket(websocket: WebSocket):
    """
    Real-time voice pipeline:
    Client sends JSON: auth | audio | ping
    Server responds: auth_ok | transcript | response | audio | error
    """
    await websocket.accept()
    db = SessionLocal()
    api_key_record: Optional[APIKey] = None
    session_id: Optional[str] = None

    try:
        try:
            raw = await websocket.receive_text()
            msg = json.loads(raw)
        except Exception:
            await websocket.send_json({"type": "error", "message": "Invalid auth message"})
            await websocket.close(code=1008)
            return

        if msg.get("type") != "auth":
            await websocket.send_json({"type": "error", "message": "First message must be auth"})
            await websocket.close(code=1008)
            return

        api_key_str = msg.get("api_key", "")
        try:
            api_key_record = validate_ws_api_key(db, api_key_str)
            session_id = str(api_key_record.id)
            if session_id not in SESSION_HISTORY:
                SESSION_HISTORY[session_id] = []
            await websocket.send_json({"type": "auth_ok", "message": "JARVIS ONLINE"})
        except HTTPException as exc:
            await websocket.send_json({"type": "error", "message": exc.detail})
            await websocket.close(code=1008)
            return

        while True:
            data = await websocket.receive()
            if data["type"] == "websocket.disconnect":
                raise WebSocketDisconnect(data.get("code", 1000))

            if "text" in data:
                try:
                    payload = json.loads(data["text"])
                except json.JSONDecodeError:
                    await websocket.send_json({"type": "error", "message": "Invalid JSON"})
                    continue

                msg_type = payload.get("type")

                if msg_type == "ping":
                    await websocket.send_json({"type": "pong"})
                    continue

                if msg_type == "audio":
                    start = time.time()
                    audio_b64 = payload.get("audio", "")
                    if not audio_b64:
                        await websocket.send_json({"type": "error", "message": "No audio data"})
                        continue

                    try:
                        audio_bytes = base64.b64decode(audio_b64)
                    except Exception:
                        await websocket.send_json({"type": "error", "message": "Invalid base64 audio"})
                        continue

                    await websocket.send_json({"type": "status", "message": "processing"})

                    # STT
                    text, language_code, confidence = await stt_service.transcribe(audio_bytes)
                    if not text:
                        await websocket.send_json({
                            "type": "transcript",
                            "text": "",
                            "language": language_code,
                            "confidence": 0.0,
                            "message": "No speech detected",
                        })
                        continue

                    await websocket.send_json({
                        "type": "transcript",
                        "text": text,
                        "language": language_code,
                        "confidence": confidence,
                    })

                    log_usage(db, api_key_record.id, "stt", time.time() - start)

                    # Brain
                    brain_start = time.time()
                    response_text, out_lang, updated_history = await brain_service.process_message(
                        text, language_code, SESSION_HISTORY[session_id]
                    )
                    SESSION_HISTORY[session_id] = updated_history
                    
                    # Assume roughly 1 token per 4 chars
                    tokens = len(response_text) // 4 
                    log_usage(db, api_key_record.id, "chat", time.time() - brain_start, tokens_used=tokens)

                    await websocket.send_json({
                        "type": "response",
                        "text": response_text,
                        "language": out_lang,
                    })

                    # TTS
                    tts_start = time.time()
                    audio_out = await tts_service.synthesize(response_text, lang_code=out_lang)
                    log_usage(db, api_key_record.id, "tts", time.time() - tts_start)

                    if audio_out:
                        await websocket.send_json({
                            "type": "audio",
                            "audio": base64.b64encode(audio_out).decode("utf-8"),
                            "sample_rate": tts_service.sample_rate,
                        })

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as exc:
        logger.exception("WebSocket error: %s", exc)
        try:
            await websocket.send_json({"type": "error", "message": str(exc)})
        except Exception:
            pass
    finally:
        db.close()

@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    api_key: APIKey = Depends(require_api_key),
    db: Session = Depends(get_db),
):
    """Transcribe uploaded audio file."""
    try:
        audio_bytes = await file.read()
        text, language_code, confidence = await stt_service.transcribe(audio_bytes)
        log_usage(db, api_key.id, "stt", duration_seconds=0.5)
        return TranscribeResponse(text=text, language=language_code, confidence=confidence)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/speak", response_model=SpeakResponse)
async def speak_text(
    body: SpeakRequest,
    api_key: APIKey = Depends(require_api_key),
    db: Session = Depends(get_db),
):
    """Convert text to speech, return base64 WAV."""
    try:
        audio_bytes = await tts_service.synthesize(body.text, lang_code=body.language)
        log_usage(db, api_key.id, "tts", duration_seconds=len(body.text) * 0.01)
        return SpeakResponse(
            audio_base64=base64.b64encode(audio_bytes).decode("utf-8") if audio_bytes else "",
            sample_rate=tts_service.sample_rate,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
