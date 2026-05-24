"""Shared helper utilities."""

from datetime import datetime, timezone
from typing import Optional


def utc_now() -> datetime:
    """Return current UTC datetime."""
    return datetime.now(timezone.utc)


def extract_first_name(full_name: str) -> str:
    """Get first name from full name for greetings."""
    if not full_name:
        return "User"
    return full_name.strip().split()[0]


def safe_float(value: Optional[float], default: float = 0.0) -> float:
    """Coerce optional float safely."""
    if value is None:
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default
