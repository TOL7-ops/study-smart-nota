import os
from functools import lru_cache
from typing import List

from dotenv import load_dotenv

# Load .env if present (override to ensure changes are picked up on reload)
load_dotenv(override=True)


class Settings:
    # App
    APP_ENV: str = os.getenv("APP_ENV", "development")
    BASE_URL: str = os.getenv("BASE_URL", "http://localhost:8000")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

    # CORS
    # Comma-separated list, e.g. "http://localhost:5173,http://localhost:8080"
    FRONTEND_ORIGINS: str = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://localhost:8080,https://study-smart-nota.vercel.app")
    # Diagnostic toggle: when true, allow all origins (credentials must be disabled)
    CORS_ALLOW_ALL: bool = os.getenv("CORS_ALLOW_ALL", "false").lower() == "true"

    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", os.getenv("SECRET_KEY", "change-me-in-prod"))
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "3600"))

    # Storage (S3 / MinIO)
    S3_ENDPOINT: str = os.getenv("S3_ENDPOINT", "http://localhost:9000")
    S3_BUCKET: str = os.getenv("S3_BUCKET", "studynote-docs")
    S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY", "minioadmin")
    S3_SECRET_KEY: str = os.getenv("S3_SECRET_KEY", "minioadmin")
    S3_REGION: str = os.getenv("S3_REGION", "us-east-1")
    SIGNED_URL_EXPIRY: int = int(os.getenv("SIGNED_URL_EXPIRY", "900"))
    # Path-style addressing is required for MinIO; AWS can use virtual-hosted-style.
    S3_USE_PATH_STYLE: bool = os.getenv("S3_USE_PATH_STYLE", "true").lower() == "true"

    # Security / Rate limits (placeholders for later phases)
    RATE_LIMIT_LOGIN_PER_MIN: int = int(os.getenv("RATE_LIMIT_LOGIN_PER_MIN", "30"))

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.FRONTEND_ORIGINS.split(",") if o.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()