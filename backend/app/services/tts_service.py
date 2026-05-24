import logging
import torch
import numpy as np
import io
import wave
from TTS.api import TTS

logger = logging.getLogger(__name__)

class TTSService:
    """
    Text-to-Speech service for the backend using Coqui XTTS-v2.
    """
    def __init__(self):
        logger.info("Initializing Backend TTS Service...")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        try:
            self.tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(self.device)
            logger.info("Backend TTS Model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load backend TTS model: {e}")
            self.tts = None
            
        self.sample_rate = 24000

    async def synthesize(self, text: str, lang_code: str) -> bytes:
        """
        Synthesizes speech and returns WAV format bytes.
        """
        if not self.tts:
            logger.error("TTS model is not loaded.")
            return b""
            
        try:
            # XTTS synthesis (using default/fallback params as in agent)
            wav_array = self.tts.tts(
                text=text,
                speaker_wav=None, # In production, set to a valid .wav file path
                language=lang_code
            )
            
            # Convert numpy array to WAV bytes
            wav_io = io.BytesIO()
            with wave.open(wav_io, 'wb') as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2) # 16-bit
                wf.setframerate(self.sample_rate)
                # Convert float32 [-1.0, 1.0] to int16
                audio_int16 = np.int16(np.array(wav_array) * 32767)
                wf.writeframes(audio_int16.tobytes())
                
            return wav_io.getvalue()
        except Exception as e:
            logger.error(f"Error during backend TTS synthesis: {e}")
            return b""

tts_service = TTSService()
