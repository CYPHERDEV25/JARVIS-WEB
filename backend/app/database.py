"""PostgreSQL database connection and session management."""

import logging
from typing import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """SQLAlchemy declarative base for all models."""

    pass


def ensure_schema_permissions() -> None:
    """
    PostgreSQL 15+ revokes CREATE on schema public by default.
    Ensure the app user can create tables (safe to run every startup).
    """
    grants = [
        "ALTER SCHEMA public OWNER TO CURRENT_USER",
        "GRANT ALL ON SCHEMA public TO CURRENT_USER",
        "GRANT CREATE ON SCHEMA public TO CURRENT_USER",
    ]
    try:
        with engine.connect() as conn:
            for stmt in grants:
                conn.execute(text(stmt))
            conn.commit()
    except Exception as exc:
        logger.warning(
            "Could not auto-fix schema permissions: %s. Run scripts/fix-postgres.bat",
            exc,
        )


def init_database() -> None:
    """Fix permissions and create tables if they do not exist."""
    ensure_schema_permissions()
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator:
    """Yield a database session and ensure it closes after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
