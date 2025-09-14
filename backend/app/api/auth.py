from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.token import AuthResponse
from app.schemas.user import UserCreate, UserLogin, UserOut

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate, db: Session = Depends(get_db)) -> AuthResponse:
    settings = get_settings()
    email_norm = payload.email.lower().strip()

    # Check if user exists
    existing = db.execute(select(User).where(User.email == email_norm)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    # Create user
    password_hash = get_password_hash(payload.password)
    user = User(
        email=email_norm,
        password_hash=password_hash,
        name=(payload.name.strip() if payload.name else None),
        university=(payload.university.strip() if payload.university else None),
    )
    db.add(user)
    db.flush()  # get user.id

    token = create_access_token(subject=user.id, additional_claims={"email": user.email, "role": user.role})
    return AuthResponse(access_token=token, expires_in=settings.JWT_ACCESS_TOKEN_EXPIRES, user=UserOut.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> AuthResponse:
    settings = get_settings()
    email_norm = payload.email.lower().strip()

    user = db.execute(select(User).where(User.email == email_norm)).scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(subject=user.id, additional_claims={"email": user.email, "role": user.role})
    return AuthResponse(access_token=token, expires_in=settings.JWT_ACCESS_TOKEN_EXPIRES, user=UserOut.model_validate(user))