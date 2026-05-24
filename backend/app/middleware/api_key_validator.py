"""API key validation middleware and dependencies."""

from typing import Optional

from fastapi import Depends, Header, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.apikey import APIKey
from app.services.key_service import check_rate_limit, validate_api_key


async def require_api_key(
    db: Session = Depends(get_db),
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    api_key: Optional[str] = Query(None),
) -> APIKey:
    """
    Validate API key from header or query param.
    Enforces daily rate limit for free tier.
    """
    raw_key = x_api_key or api_key
    if not raw_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required. Pass via X-API-Key header or api_key query param.",
        )

    key_record = validate_api_key(db, raw_key)
    if not key_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key",
        )

    allowed, used, limit = check_rate_limit(db, key_record)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Daily rate limit exceeded ({used}/{limit} requests)",
        )

    return key_record


def validate_ws_api_key(db: Session, raw_key: str) -> APIKey:
    """Validate API key for WebSocket connections (raises on failure)."""
    if not raw_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required",
        )
    key_record = validate_api_key(db, raw_key)
    if not key_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key",
        )
    allowed, used, limit = check_rate_limit(db, key_record)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Daily rate limit exceeded ({used}/{limit})",
        )
    return key_record
