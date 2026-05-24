"""Usage statistics and history routes."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.usage import UsageLog
from app.models.user import User
from app.schemas.apikey import UsageHistoryItem, UsageHistoryResponse, UsageStatsResponse
from app.services.auth_service import get_current_user
from app.services.key_service import check_rate_limit, get_active_api_key

router = APIRouter(prefix="/api/usage", tags=["usage"])
settings = get_settings()


@router.get("/stats", response_model=UsageStatsResponse)
def get_usage_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Dashboard usage statistics."""
    api_key = get_active_api_key(db, current_user.id)
    if not api_key:
        return UsageStatsResponse(
            total_requests_today=0,
            total_minutes_used=0.0,
            api_key_status="Inactive",
            daily_limit=settings.free_tier_daily_limit,
            remaining_requests=settings.free_tier_daily_limit,
        )

    today_start = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    today_logs = (
        db.query(UsageLog)
        .filter(
            UsageLog.api_key_id == api_key.id,
            UsageLog.created_at >= today_start,
        )
        .all()
    )

    total_requests = len(today_logs)
    total_seconds = sum(log.duration_seconds for log in today_logs)
    _, used, limit = check_rate_limit(db, api_key)

    return UsageStatsResponse(
        total_requests_today=total_requests,
        total_minutes_used=round(total_seconds / 60.0, 2),
        api_key_status="Active" if api_key.is_active else "Inactive",
        daily_limit=limit,
        remaining_requests=max(0, limit - used),
    )


@router.get("/history", response_model=UsageHistoryResponse)
def get_usage_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """Paginated usage history for current user."""
    api_key = get_active_api_key(db, current_user.id)
    if not api_key:
        return UsageHistoryResponse(items=[], total=0)

    query = (
        db.query(UsageLog)
        .filter(UsageLog.api_key_id == api_key.id)
        .order_by(UsageLog.created_at.desc())
    )
    total = query.count()
    logs = query.offset(offset).limit(limit).all()

    return UsageHistoryResponse(
        items=[UsageHistoryItem.model_validate(log) for log in logs],
        total=total,
    )
