from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def create_access_token(subject: str, additional_claims: Optional[Dict[str, Any]] = None, expires_seconds: Optional[int] = None) -> str:
    """
    Create a signed JWT access token.

    subject: typically the user id (sub claim)
    additional_claims: any extra claims to include (role, email, etc.)
    expires_seconds: override default expiry in seconds
    """
    settings = get_settings()
    expire_delta = timedelta(seconds=expires_seconds or settings.JWT_ACCESS_TOKEN_EXPIRES)
    now = datetime.now(timezone.utc)
    expire = now + expire_delta

    to_encode: Dict[str, Any] = {"sub": subject, "iat": int(now.timestamp()), "exp": int(expire.timestamp())}
    if additional_claims:
        to_encode.update(additional_claims)

    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode a JWT token and return its claims if valid; otherwise return None.
    """
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None