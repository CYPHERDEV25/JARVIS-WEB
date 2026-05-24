"""Chat endpoints for the platform and embeddable widget."""

from typing import List, AsyncGenerator
import uuid
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.conversation import Conversation, Message
from app.schemas.chat import (
    ChatMessageRequest,
    ConversationSchema,
    MessageSchema,
    NewConversationResponse,
)
from app.services.chat_service import ChatService
from app.services.key_service import validate_api_key, check_rate_limit, log_usage
from app.middleware.api_key_validator import require_api_key

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/message")
async def send_message(req: ChatMessageRequest, db: Session = Depends(get_db)):
    """Send a message to the chatbot and get a streaming response."""
    key_record = validate_api_key(db, req.api_key)
    if not key_record:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    allowed, used, limit = check_rate_limit(db, key_record)
    if not allowed:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    conversation_id_str = req.conversation_id
    
    if not conversation_id_str:
        conv = Conversation(user_id=key_record.user_id, api_key_id=key_record.id, title="")
        db.add(conv)
        db.commit()
        db.refresh(conv)
        conversation_id_str = str(conv.id)
    else:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id_str).first()
        if not conv or conv.api_key_id != key_record.id:
            raise HTTPException(status_code=404, detail="Conversation not found or unauthorized")

    lang_code = ChatService.detect_language(req.message)
    ChatService.save_message(db, conversation_id_str, "user", req.message, lang_code)
    
    history = ChatService.get_conversation_history(db, conversation_id_str)
    
    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            async for token in ChatService.stream_response(req.message, conversation_id_str, lang_code, history, db):
                yield token
        except Exception as e:
            logger.error(f"Stream error: {e}")
            yield f"\n\nError: {e}"
            
    # The frontend is using standard fetch with ReadableStream, so raw text chunks work perfectly
    return StreamingResponse(event_generator(), media_type="text/plain")

@router.get("/history/{conversation_id}", response_model=List[MessageSchema])
def get_conversation_history(conversation_id: str, api_key_record = Depends(require_api_key), db: Session = Depends(get_db)):
    """Return full conversation history."""
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv or conv.api_key_id != api_key_record.id:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()
    return messages

@router.delete("/history/{conversation_id}")
def delete_conversation(conversation_id: str, api_key_record = Depends(require_api_key), db: Session = Depends(get_db)):
    """Clear conversation."""
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv or conv.api_key_id != api_key_record.id:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    db.delete(conv)
    db.commit()
    return {"status": "success"}

@router.post("/new", response_model=NewConversationResponse)
def create_new_conversation(api_key_record = Depends(require_api_key), db: Session = Depends(get_db)):
    """Create new conversation."""
    conv = Conversation(user_id=api_key_record.user_id, api_key_id=api_key_record.id, title="New Chat")
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return {"conversation_id": str(conv.id)}

@router.get("/conversations", response_model=List[ConversationSchema])
def list_conversations(api_key_record = Depends(require_api_key), db: Session = Depends(get_db)):
    """List all user conversations."""
    convs = db.query(Conversation).filter(Conversation.api_key_id == api_key_record.id).order_by(Conversation.updated_at.desc()).all()
    
    result = []
    for c in convs:
        count = db.query(func.count(Message.id)).filter(Message.conversation_id == c.id).scalar() or 0
        result.append(
            ConversationSchema(
                id=c.id,
                title=c.title or "New Chat",
                created_at=c.created_at,
                updated_at=c.updated_at,
                message_count=count
            )
        )
    return result
