import logging
import sys
import os
from typing import Tuple, List, Dict
import ollama

# Add agent directory to sys.path to import prompt.py
agent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../agent"))
if agent_dir not in sys.path:
    sys.path.append(agent_dir)

try:
    from prompt import JARVIS_SYSTEM_PROMPT
except ImportError:
    # Fallback if agent/prompt.py is not reachable
    JARVIS_SYSTEM_PROMPT = "You are J.A.R.V.I.S. A highly advanced AI assistant. Always respond in the language spoken to you."

logger = logging.getLogger(__name__)

class BrainService:
    """
    Brain service for the backend, interacting with Ollama.
    """
    def __init__(self, model_name="llama2"):
        self.model_name = model_name
        logger.info(f"Backend Brain initialized with model: {self.model_name}")

    async def process_message(self, text: str, lang_code: str, history: List[Dict[str, str]]) -> Tuple[str, str, List[Dict[str, str]]]:
        """
        Processes a user message.
        Returns (response_text, lang_code, updated_history).
        """
        if not history:
            history = [{"role": "system", "content": JARVIS_SYSTEM_PROMPT}]
            
        history.append({"role": "user", "content": text})
        
        # Keep history to a reasonable limit (e.g. 10 messages)
        max_history = 10
        if len(history) > max_history + 1:
            history = [history[0]] + history[-(max_history):]
            
        try:
            # Force language constraint
            lang_instruction = f"IMPORTANT: Respond EXCLUSIVELY in the language associated with this ISO code: '{lang_code}'."
            temp_history = history.copy()
            temp_history.insert(-1, {"role": "system", "content": lang_instruction})

            response = ollama.chat(model=self.model_name, messages=temp_history)
            reply = response['message']['content'].strip()
            
            history.append({"role": "assistant", "content": reply})
            return reply, lang_code, history
            
        except Exception as e:
            logger.error(f"Error in backend BrainService: {e}")
            return "Server error while processing your request.", "en", history

brain_service = BrainService()
