import os
import logging
import base64
from dotenv import load_dotenv
from typing import Optional, List
import json
from pathlib import Path

load_dotenv()  # Load .env file


def get_global_config_dir() -> Path:
    import platform
    p = platform.system()
    home = Path.home()
    if p == 'Windows':
        return Path(os.getenv('APPDATA', home / 'AppData' / 'Roaming')) / 'TIF-AI'
    elif p == 'Darwin':
        return home / 'Library' / 'Application Support' / 'TIF-AI'
    else:
        return home / '.config' / 'tif-ai'

def get_encryption_key() -> bytes:
    key_path = get_global_config_dir() / '.tif-ai.key'
    if key_path.exists():
        try:
            return key_path.read_bytes()
        except Exception:
            pass
    return b''

def decrypt_value(val: Optional[str]) -> Optional[str]:
    if not val or not val.startswith('enc:'):
        return val
    payload = val[4:]
    key = get_encryption_key()
    if not key or len(key) != 32:
        return val
    try:
        # AES-256-GCM format: enc:<iv_hex>:<tag_hex>:<ciphertext_hex>
        if payload.count(':') == 2:
            from cryptography.hazmat.primitives.ciphers.aead import AESGCM
            parts = payload.split(':')
            iv = bytes.fromhex(parts[0])
            tag = bytes.fromhex(parts[1])
            ct = bytes.fromhex(parts[2])
            aesgcm = AESGCM(key)
            plain = aesgcm.decrypt(iv, ct + tag, None)
            return plain.decode('utf-8')
        # Legacy XOR format: enc:<hex>
        else:
            cipher_bytes = bytes.fromhex(payload)
            plain_bytes = bytearray(len(cipher_bytes))
            for i in range(len(cipher_bytes)):
                plain_bytes[i] = cipher_bytes[i] ^ key[i % len(key)]
            return plain_bytes.decode('utf-8')
    except Exception:
        return val

class Settings:
    PROJECT_NAME: str = 'TIF-AI'
    API_V1_STR: str = '/api/v1'
    
    # Direct fallback variables from .env
    OPENAI_API_KEY: Optional[str] = os.getenv('OPENAI_API_KEY')
    GEMINI_API_KEY: Optional[str] = os.getenv('GEMINI_API_KEY')
    
    # Unified AI configuration populated from JSON
    AI_PROVIDER: str = 'fallback'
    AI_API_KEY: Optional[str] = None
    AI_ENDPOINT: Optional[str] = None
    AI_MODEL: Optional[str] = None
    AI_DEPLOYMENT_NAME: Optional[str] = None
    AI_API_VERSION: Optional[str] = None
    OLLAMA_MODELS: List[str] = []
    
    # Database
    DATABASE_URL: Optional[str] = os.getenv('DATABASE_URL', 'sqlite:///./test.db')
    
    # Misc
    DEBUG: bool = os.getenv('DEBUG', 'false').lower() == 'true'
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info").lower()

    def __init__(self):
        # Resolve config/ai-config.json in the project root
        config_path = get_global_config_dir() / 'ai-config.json'
        
        if config_path.exists():
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                ai_config = config.get('ai', {})
                self.AI_PROVIDER = ai_config.get('provider', 'fallback').lower()
                
                # Decrypt keys if encrypted
                raw_key = ai_config.get('apiKey')
                self.AI_API_KEY = decrypt_value(raw_key)
                
                self.AI_ENDPOINT = ai_config.get('endpoint')
                self.AI_MODEL = ai_config.get('model')
                self.AI_DEPLOYMENT_NAME = ai_config.get('deploymentName')
                self.AI_API_VERSION = ai_config.get('apiVersion')
                
                self.OLLAMA_MODELS = config.get('ollama', {}).get('models', [])
                
                # Fallback compatibility
                if self.AI_PROVIDER == 'openai':
                    self.OPENAI_API_KEY = self.AI_API_KEY
                elif self.AI_PROVIDER == 'gemini':
                    self.GEMINI_API_KEY = self.AI_API_KEY
            except Exception:
                pass # Fallback silently to env vars

settings = Settings()





def setup_logger():
    log_dir = get_global_config_dir() / 'logs'
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = log_dir / 'backend.log'

    logger = logging.getLogger('backend')
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
        fh = logging.FileHandler(log_file, encoding='utf-8')
        fh.setFormatter(formatter)
        logger.addHandler(fh)
        sh = logging.StreamHandler()
        sh.setFormatter(formatter)
        logger.addHandler(sh)
    return logger

logger = setup_logger()
