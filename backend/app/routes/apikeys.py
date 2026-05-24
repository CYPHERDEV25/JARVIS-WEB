"""API key management routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.apikey import APIKeyRegenerateResponse, APIKeyResponse
from app.schemas.user import MessageResponse
from app.services.auth_service import get_current_user
from app.services.key_service import (
    create_api_key_for_user,
    get_active_api_key,
    mask_api_key,
)

router = APIRouter(prefix="/api/keys", tags=["api-keys"])


def _to_response(api_key) -> APIKeyResponse:
    return APIKeyResponse(
        id=api_key.id,
        key_prefix=api_key.key_prefix,
        is_active=api_key.is_active,
        created_at=api_key.created_at,
        last_used_at=api_key.last_used_at,
        masked_key=mask_api_key(api_key.key_prefix),
    )


@router.get("/", response_model=APIKeyResponse)
def get_api_key(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's masked API key."""
    api_key = get_active_api_key(db, current_user.id)
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active API key found",
        )
    return _to_response(api_key)


@router.post("/regenerate", response_model=APIKeyRegenerateResponse)
def regenerate_api_key(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a new API key (invalidates previous)."""
    api_key, raw_key = create_api_key_for_user(db, current_user)
    return APIKeyRegenerateResponse(
        api_key=raw_key,
        key_prefix=api_key.key_prefix,
    )


@router.delete("/", response_model=MessageResponse)
def delete_api_key(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deactivate user's API key."""
    api_key = get_active_api_key(db, current_user.id)
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active API key to delete",
        )
    api_key.is_active = False
    db.commit()
    return MessageResponse(message="API key deactivated")
