"""Pydantic schemas for Chat."""

import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ChatMessageRequest(BaseModel):
    message: str = Field(..., description="The user's message")
    conversation_id: Optional[str] = Field(None, description="UUID of existing conversation, or None for new")
    api_key: str = Field(..., description="API Key for the request")


class ChatMessageResponse(BaseModel):
    response: str
    conversation_id: str
    model: str
    language: str


class MessageSchema(BaseModel):
    id: uuid.UUID
    role: str
    content: str
    language_code: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationSchema(BaseModel):
    id: uuid.UUID
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    class Config:
        from_attributes = True


class NewConversationResponse(BaseModel):
    conversation_id: str
