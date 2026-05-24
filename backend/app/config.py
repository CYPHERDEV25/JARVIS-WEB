"""Application configuration loaded from environment variables."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration for the JARVIS backend."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    database_url: str = "postgresql://jarvis:jarvis_secret@localhost:5432/jarvis"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "llama3.1:8b"
    whisper_model: str = "medium"
    kokoro_voice: str = "bm_lewis"
    cors_origins: str = "http://localhost:3000"
    free_tier_daily_limit: int = 100
    cookie_secure: bool = False
    cookie_domain: str = "localhost"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()
