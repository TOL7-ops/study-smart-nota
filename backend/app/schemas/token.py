from __future__ import annotations

from pydantic import BaseModel
from app.schemas.user import UserOut


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class AuthResponse(Token):
    # Extend token with user payload for convenience on the client
    user: UserOut