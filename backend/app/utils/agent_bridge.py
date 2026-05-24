"""
Bridge to import shared agent modules (prompt, tools, language_handler).
"""

import sys
from pathlib import Path

_AGENT_PATH = Path(__file__).resolve().parents[3] / "agent"


def ensure_agent_path() -> Path:
    """Add agent directory to sys.path for imports."""
    agent_str = str(_AGENT_PATH)
    if agent_str not in sys.path:
        sys.path.insert(0, agent_str)
    return _AGENT_PATH
