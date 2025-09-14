from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.core.deps import get_current_user, get_current_user_id
from app.models.document import Document
from app.models.user import User
from app.schemas.document import (
    DocumentCreate,
    DocumentOut,
    SignedUrlRequest,
    SignedUrlResponse,
)
from app.services.s3_client import (
    build_object_url,
    generate_presigned_put_url,
    sanitize_filename,
)

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/signed-url", response_model=SignedUrlResponse)
def generate_signed_url(
    payload: SignedUrlRequest,
    user_id: str = Depends(get_current_user_id),
) -> SignedUrlResponse:
    """
    Generate a pre-signed PUT URL for the client to upload a file directly to S3/MinIO.
    The client must upload using method=PUT and include the same Content-Type header.
    """
    settings = get_settings()

    safe_name = sanitize_filename(payload.filename)
    key = f"{user_id}/{uuid4()}_{safe_name}"

    presigned = generate_presigned_put_url(
        bucket=settings.S3_BUCKET,
        key=key,
        content_type=payload.content_type,
        expires_in=settings.SIGNED_URL_EXPIRY,
    )
    file_url = build_object_url(bucket=settings.S3_BUCKET, key=key)

    return SignedUrlResponse(
        upload_url=presigned,
        file_url=file_url,
        key=key,
        expires_in=settings.SIGNED_URL_EXPIRY,
        required_headers={"Content-Type": payload.content_type},
    )


@router.post("", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
def register_document(
    payload: DocumentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> DocumentOut:
    """
    Register a document after uploading to object storage. This records metadata and
    marks status as 'processing' for later pipeline steps.
    """
    # Basic input normalization
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Title is required")

    doc = Document(
        user_id=user.id,
        title=title,
        file_url=payload.file_url.strip(),
        course=(payload.course.strip() if payload.course else None),
        status="processing",
        pages=payload.pages,
        size_bytes=payload.size_bytes,
        version=payload.version or 1,
    )
    db.add(doc)
    db.flush()

    return DocumentOut.model_validate(doc)


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(
    document_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> DocumentOut:
    """
    Retrieve a document's metadata. Only the owner can access.
    """
    doc = db.execute(select(Document).where(Document.id == document_id)).scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    if doc.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return DocumentOut.model_validate(doc)