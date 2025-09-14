from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl, ConfigDict


class SignedUrlRequest(BaseModel):
    filename: str = Field(..., description="Original filename from client")
    content_type: str = Field(..., description="MIME type, e.g. application/pdf")
    # Optional hints from client
    size_bytes: Optional[int] = Field(None, ge=0)


class SignedUrlResponse(BaseModel):
    upload_url: str = Field(..., description="Pre-signed PUT URL to upload directly to S3/MinIO")
    file_url: str = Field(..., description="Canonical object URL for later reference")
    key: str = Field(..., description="Object key within the bucket")
    expires_in: int = Field(..., description="Seconds until the pre-signed URL expires")
    required_headers: dict = Field(
        default_factory=lambda: {"Content-Type": "<same-as-request>"},
        description="Headers the client must include when performing the PUT",
    )


class DocumentCreate(BaseModel):
    title: str
    file_url: str
    course: Optional[str] = None
    pages: Optional[int] = Field(None, ge=1)
    size_bytes: Optional[int] = Field(None, ge=0)
    version: Optional[int] = Field(None, ge=1)


class DocumentOut(BaseModel):
    id: str
    user_id: str
    title: str
    file_url: str
    course: Optional[str] = None
    status: str
    pages: Optional[int] = None
    size_bytes: Optional[int] = None
    version: int
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)