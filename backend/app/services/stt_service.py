import logging
import os
import tempfile
from typing import Tuple
from faster_whisper import WhisperModel

logger = logging.getLogger(__name__)

class STTService:
    """
    Speech-to-Text service for the backend using faster-whisper.
    """
    def __init__(self):
        logger.info("Initializing Backend STT Service...")
        try:
            # Load model once on startup
            self.model = WhisperModel("medium", device="auto", compute_type="default")
            logger.info("Backend STT Model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load backend STT model: {e}")
            self.model = None

    async def transcribe(self, audio_bytes: bytes) -> Tuple[str, str, float]:
        """
        Transcribes audio bytes to text.
        Returns (text, language_code, confidence).
        """
        if not self.model:
            logger.error("STT model is not loaded.")
            return "", "en", 0.0

        temp_file = None
        try:
            # Write bytes to temp file since faster-whisper expects a file path
            temp_file = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
            temp_file.write(audio_bytes)
            temp_file.flush()
            temp_file.close()

            segments, info = self.model.transcribe(
                temp_file.name,
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=500),
                language=None # Auto detect
            )
            
            # Combine text from all segments
            text = " ".join([segment.text for segment in segments]).strip()
            return text, info.language, info.language_probability
            
        except Exception as e:
            logger.error(f"Error during backend transcription: {e}")
            return "", "en", 0.0
        finally:
            if temp_file and os.path.exists(temp_file.name):
                os.unlink(temp_file.name)

stt_service = STTService()
