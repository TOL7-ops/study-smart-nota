from __future__ import annotations
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import Base, engine
from app.api.auth import router as auth_router
from app.api.documents import router as documents_router  # Phase 2

# Ensure models are imported so metadata includes their tables before create_all
# noqa imports used only for side effects
from app.models import user as _models_user  # noqa: F401
from app.models import document as _models_document  # noqa: F401

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("studynote.api")

def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="AI Study Note Tool API",
        version="0.2.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def on_startup() -> None:
        # Create tables if they don't exist (Phase 1/2; later Alembic manages migrations)
        Base.metadata.create_all(bind=engine)
        try:
            logger.info("Database initialized: %s", engine.url.render_as_string(hide_password=True))
        except Exception:
            logger.info("Database initialized.")

    @app.get("/health")
    def health():
        return {"status": "ok"}

    # Routers
    app.include_router(auth_router)
    app.include_router(documents_router)

    return app

app = create_app()