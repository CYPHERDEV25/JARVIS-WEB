"""Chat service for handling conversations and streaming LLM responses."""

import logging
from typing import AsyncGenerator
from sqlalchemy.orm import Session
from sqlalchemy import func
import ollama
from langdetect import detect, LangDetectException

from app.models.conversation import Conversation, Message
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

JARVIS_SYSTEM_PROMPT = """You are Jarvis, an advanced AI assistant built on the Jarvis Platform.
You are helpful, concise, and use clear formatting like Markdown where appropriate.
If someone asks who you are, explain that you are Jarvis, a self-hosted AI."""

class ChatService:
    @staticmethod
    def detect_language(text: str) -> str:
        """Detect the language of the provided text."""
        try:
            return detect(text)
        except LangDetectException:
            return "en"

    @staticmethod
    def get_conversation_history(db: Session, conversation_id: str) -> list:
        """Get the last 20 messages for the conversation."""
        messages = (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(20)
            .all()
        )
        # Reverse to get chronological order
        messages.reverse()
        return [{"role": m.role, "content": m.content} for m in messages]

    @staticmethod
    def save_message(db: Session, conversation_id: str, role: str, content: str, language: str):
        """Save a message to the database."""
        msg = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            language_code=language
        )
        db.add(msg)
        
        # Update conversation timestamp
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if conv:
            # We must set a new title if this is the first message and it's a user message
            if role == "user" and (not conv.title or conv.title.strip() == ""):
                conv.title = content[:50] + ("..." if len(content) > 50 else "")
            
            # The onupdate triggers on any update, but we can also manually touch a field
            # if we just want to update the timestamp. Wait, updated_at has onupdate=func.now()
            # so modifying title triggers it. If we don't modify title, we might need to force an update.
            # To force onupdate, we could just do:
            db.query(Conversation).filter(Conversation.id == conversation_id).update({"updated_at": func.now()})
            
        db.commit()

    @staticmethod
    async def stream_response(message: str, conversation_id: str, language_code: str, history: list, db: Session) -> AsyncGenerator[str, None]:
        """Stream the LLM response using Ollama and save the final message."""
        messages = [{"role": "system", "content": JARVIS_SYSTEM_PROMPT}]
        messages.extend(history)
        messages.append({"role": "user", "content": message})
        
        client = ollama.AsyncClient(host=settings.ollama_host)
        
        full_response = ""
        try:
            response = await client.chat(model=settings.ollama_model, messages=messages, stream=True)
            async for chunk in response:
                if 'message' in chunk and 'content' in chunk['message']:
                    content = chunk['message']['content']
                    full_response += content
                    yield content
                    
        except Exception as e:
            logger.error(f"Error in stream_response: {e}")
            yield f"\n\nError generating response: {str(e)}"
        
        finally:
            if full_response:
                # Need to save the assistant's message.
                # Since this is an async generator, the db session might be closed or running in another thread.
                # In FastAPI, StreamingResponse keeps the background context alive.
                # However, doing sync DB operations in async finally block can be risky.
                # To be safe, we do it in a try-except.
                try:
                    ChatService.save_message(db, conversation_id, "assistant", full_response, language_code)
                except Exception as save_err:
                    logger.error(f"Failed to save assistant message: {save_err}")
