import json
import os
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).resolve().parents[2] / 'data'
PROVIDERS_FILE = DATA_DIR / 'providers.json'

DEFAULT_PROVIDERS = [
    {
        "id": "ollama",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "http://localhost:11434",
        "model": "",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 60,
        "streaming": True,
        "models": [],
    },
    {
        "id": "lmstudio",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "http://localhost:1234/v1",
        "model": "",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 60,
        "streaming": True,
        "models": [],
    },
    {
        "id": "openai",
        "enabled": True,
        "isDefault": True,
        "apiKey": "",
        "baseUrl": "https://api.openai.com/v1",
        "model": "gpt-4o",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "google",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "https://generativelanguage.googleapis.com/v1beta",
        "model": "gemini-2.5-flash",
        "temperature": 0.7,
        "maxTokens": 8192,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "nvidia",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "https://integrate.api.nvidia.com/v1",
        "model": "",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "openrouter",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "https://openrouter.ai/api/v1",
        "model": "",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "anthropic",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "https://api.anthropic.com/v1",
        "model": "claude-sonnet-4",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "groq",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "https://api.groq.com/openai/v1",
        "model": "",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "mistral",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "https://api.mistral.ai/v1",
        "model": "mistral-large",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "deepseek",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "https://api.deepseek.com/v1",
        "model": "deepseek-chat",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "xai",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "https://api.x.ai/v1",
        "model": "grok-4",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "azure",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "https://YOUR_RESOURCE.openai.azure.com",
        "model": "",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
    {
        "id": "custom",
        "enabled": False,
        "isDefault": False,
        "apiKey": "",
        "baseUrl": "",
        "model": "",
        "temperature": 0.7,
        "maxTokens": 4096,
        "topP": 1.0,
        "timeout": 30,
        "streaming": True,
        "models": [],
    },
]


def _mask_key(key: str) -> str:
    if not key or len(key) < 8:
        return key
    return key[:4] + '*' * (len(key) - 8) + key[-4:]


def _mask_providers(providers: list) -> list:
    masked = []
    for p in providers:
        p = dict(p)
        if p.get('apiKey'):
            p['apiKey'] = _mask_key(p['apiKey'])
        masked.append(p)
    return masked


def load_providers() -> list:
    if not PROVIDERS_FILE.exists():
        return []
    try:
        with open(PROVIDERS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get('providers', [])
    except Exception:
        return []


def save_providers(providers: list):
    os.makedirs(PROVIDERS_FILE.parent, exist_ok=True)
    with open(PROVIDERS_FILE, 'w', encoding='utf-8') as f:
        json.dump({'providers': providers}, f, indent=2, ensure_ascii=False)


def get_providers_masked() -> list:
    return _mask_providers(load_providers())


def reset_defaults():
    save_providers(DEFAULT_PROVIDERS)
    return _mask_providers(DEFAULT_PROVIDERS)


def get_default_provider() -> Optional[dict]:
    providers = load_providers()
    for p in providers:
        if p.get('isDefault') and p.get('enabled'):
            return p
    for p in providers:
        if p.get('enabled'):
            return p
    return providers[0] if providers else None
