from __future__ import annotations

import re
from functools import lru_cache
from typing import Dict

import boto3
from botocore.config import Config

from app.core.config import get_settings


@lru_cache(maxsize=1)
def _boto_s3_client():
    s = get_settings()
    cfg = Config(
        signature_version="s3v4",
        s3={"addressing_style": "path" if s.S3_USE_PATH_STYLE else "auto"},
    )
    client = boto3.client(
        "s3",
        endpoint_url=s.S3_ENDPOINT,
        aws_access_key_id=s.S3_ACCESS_KEY,
        aws_secret_access_key=s.S3_SECRET_KEY,
        region_name=s.S3_REGION,
        config=cfg,
    )
    return client


def generate_presigned_put_url(bucket: str, key: str, content_type: str, expires_in: int) -> str:
    """
    Generate a presigned URL that allows a client to PUT an object directly to S3/MinIO.
    The client must use method=PUT and include the Content-Type header used here.
    """
    client = _boto_s3_client()
    return client.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": bucket, "Key": key, "ContentType": content_type},
        ExpiresIn=expires_in,
        HttpMethod="PUT",
    )


def build_object_url(bucket: str, key: str) -> str:
    """
    Build a canonical object URL usable by clients to later GET the object (if public) or for reference.
    For MinIO/local dev we compose using endpoint + /bucket/key.
    For AWS, if using virtual-hosted-style and endpoint looks like amazonaws, return the standard form.
    """
    s = get_settings()
    endpoint = s.S3_ENDPOINT.rstrip("/")
    if "amazonaws.com" in endpoint and not s.S3_USE_PATH_STYLE:
        # Standard AWS style
        return f"https://{bucket}.s3.{s.S3_REGION}.amazonaws.com/{key}"
    # Path-style (works with MinIO and AWS when forced)
    return f"{endpoint}/{bucket}/{key}"


_filename_re = re.compile(r"[^A-Za-z0-9._-]+")


def sanitize_filename(name: str) -> str:
    """
    Sanitize a filename to a safe S3 object key segment.
    Keeps alphanumerics, dot, underscore, hyphen. Replaces others with '-'.
    """
    name = name.strip()
    # remove directory components if present
    name = name.split("/")[-1].split("\\")[-1]
    name = _filename_re.sub("-", name)
    # collapse multiple dashes
    name = re.sub(r"-{2,}", "-", name).strip("-")
    return name or "file"