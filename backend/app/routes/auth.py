"""Authentication routes: signup, login, logout, me."""

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    MessageResponse,
    SignupResponse,
    TokenResponse,
    UserLogin,
    UserResponse,
    UserSignup,
)
from app.services.auth_service import (
    authenticate_user,
    blacklist_token,
    create_access_token,
    get_current_user,
    get_password_hash,
    get_user_by_email,
)
from app.services.key_service import create_api_key_for_user

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()


@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    """Create account and auto-generate API key."""
    existing = get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        email=payload.email.lower(),
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name.strip(),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    _, raw_key = create_api_key_for_user(db, user)

    return SignupResponse(
        user=UserResponse.model_validate(user),
        api_key=raw_key,
    )


@router.post("/login", response_model=TokenResponse)
def login(
    payload: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
):
    """Login and set JWT in httpOnly cookie."""
    user = authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(str(user.id))
    response.set_cookie(
        key="jarvis_token",
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        domain=settings.cookie_domain if settings.cookie_domain != "localhost" else None,
        path="/",
    )

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/logout", response_model=MessageResponse)
def logout(
    response: Response,
    current_user: User = Depends(get_current_user),
):
    """Clear auth cookie and blacklist token if provided in header."""
    response.delete_cookie(key="jarvis_token", path="/")
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return UserResponse.model_validate(current_user)
