"""API Key Pydantic schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class APIKeyResponse(BaseModel):
    """Masked API key for dashboard display."""

    id: UUID
    key_prefix: str
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime] = None
    masked_key: str

    model_config = {"from_attributes": True}


class APIKeyRegenerateResponse(BaseModel):
    """Response when regenerating a key — includes full key once."""

    api_key: str
    key_prefix: str
    message: str = "New API key generated. Store it securely."


class UsageStatsResponse(BaseModel):
    """Usage statistics for dashboard."""

    total_requests_today: int
    total_minutes_used: float
    api_key_status: str
    daily_limit: int
    remaining_requests: int


class UsageHistoryItem(BaseModel):
    """Single usage log entry."""

    id: UUID
    request_type: str
    duration_seconds: float
    tokens_used: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UsageHistoryResponse(BaseModel):
    """Paginated usage history."""

    items: list[UsageHistoryItem]
    total: int
