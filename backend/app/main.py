"""FastAPI application entry point for JARVIS Platform."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_database
from app.routes import apikeys, auth, usage, voice, chat

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup (use Alembic in production migrations)."""
    logger.info("Starting JARVIS backend...")
    init_database()
    yield
    logger.info("Shutting down JARVIS backend...")


app = FastAPI(
    title="JARVIS Voice AI Platform",
    description="Self-hosted Voice AI Assistant API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(apikeys.router)
app.include_router(usage.router)
app.include_router(voice.router)
app.include_router(chat.router)


@app.get("/health")
def health_check():
    """Server health check."""
    return {
        "status": "healthy",
        "service": "jarvis-backend",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
