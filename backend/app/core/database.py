from __future__ import annotations

import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    """SQLAlchemy Declarative Base."""


def _build_connect_args(database_url: str) -> dict:
    # Needed for SQLite to allow usage in multi-threaded FastAPI
    if database_url.startswith("sqlite"):
        return {"check_same_thread": False}
    return {}


def get_engine():
    settings = get_settings()
    engine = create_engine(
        settings.DATABASE_URL,
        future=True,
        pool_pre_ping=True,
        connect_args=_build_connect_args(settings.DATABASE_URL),
    )
    return engine


# Engine and Session factory (created once at import)
engine = get_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db() -> Generator:
    """
    FastAPI dependency that provides a transactional database session.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()