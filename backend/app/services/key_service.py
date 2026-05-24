"""API key generation, hashing, and validation."""

import secrets
import string
from datetime import datetime, timezone
from typing import Optional, Tuple
from uuid import UUID

from passlib.context import CryptContext
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.apikey import APIKey
from app.models.usage import UsageLog
from app.models.user import User

settings = get_settings()
key_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_api_key() -> str:
    """Generate a secure API key in jrv_sk_ format."""
    alphabet = string.ascii_letters + string.digits
    random_part = "".join(secrets.choice(alphabet) for _ in range(24))
    return f"jrv_sk_{random_part}"


def hash_api_key(raw_key: str) -> str:
    """Hash API key with bcrypt for storage."""
    return key_context.hash(raw_key)


def verify_api_key(raw_key: str, key_hash: str) -> bool:
    """Verify raw key against stored bcrypt hash."""
    return key_context.verify(raw_key, key_hash)


def get_key_prefix(raw_key: str, length: int = 12) -> str:
    """First N characters for display (e.g. jrv_sk_abc1)."""
    return raw_key[:length]


def mask_api_key(prefix: str) -> str:
    """Masked display string for dashboard."""
    return f"{prefix}{'•' * 16}"


def create_api_key_for_user(db: Session, user: User) -> Tuple[APIKey, str]:
    """Create a new API key for user, deactivating any existing active key."""
    existing = (
        db.query(APIKey)
        .filter(APIKey.user_id == user.id, APIKey.is_active.is_(True))
        .all()
    )
    for key in existing:
        key.is_active = False

    raw_key = generate_api_key()
    api_key = APIKey(
        user_id=user.id,
        key_hash=hash_api_key(raw_key),
        key_prefix=get_key_prefix(raw_key),
        is_active=True,
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    return api_key, raw_key


def get_active_api_key(db: Session, user_id: UUID) -> Optional[APIKey]:
    """Get user's active API key record."""
    return (
        db.query(APIKey)
        .filter(APIKey.user_id == user_id, APIKey.is_active.is_(True))
        .first()
    )


def validate_api_key(db: Session, raw_key: str) -> Optional[APIKey]:
    """Validate API key and return matching record if valid."""
    if not raw_key or not raw_key.startswith("jrv_sk_"):
        return None

    prefix = get_key_prefix(raw_key)
    candidates = (
        db.query(APIKey)
        .filter(APIKey.key_prefix == prefix, APIKey.is_active.is_(True))
        .all()
    )
    for candidate in candidates:
        if verify_api_key(raw_key, candidate.key_hash):
            candidate.last_used_at = datetime.now(timezone.utc)
            db.commit()
            return candidate
    return None


def count_daily_requests(db: Session, api_key_id: UUID) -> int:
    """Count usage log entries for today for rate limiting."""
    today_start = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    return (
        db.query(func.count(UsageLog.id))
        .filter(
            UsageLog.api_key_id == api_key_id,
            UsageLog.created_at >= today_start,
        )
        .scalar()
        or 0
    )


def check_rate_limit(db: Session, api_key: APIKey) -> Tuple[bool, int, int]:
    """Return (allowed, used_today, limit)."""
    used = count_daily_requests(db, api_key.id)
    limit = settings.free_tier_daily_limit
    return used < limit, used, limit


def log_usage(
    db: Session,
    api_key_id: UUID,
    request_type: str,
    duration_seconds: float = 0.0,
    tokens_used: int = 0,
) -> UsageLog:
    """Record a usage event."""
    log = UsageLog(
        api_key_id=api_key_id,
        request_type=request_type,
        duration_seconds=duration_seconds,
        tokens_used=tokens_used,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
