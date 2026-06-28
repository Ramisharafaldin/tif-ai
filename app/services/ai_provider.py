"""
AI Provider abstraction layer.
Supports all 7 major AI providers: OpenAI, Gemini, Ollama, LM Studio, OpenRouter, Azure OpenAI, and Custom endpoints.
"""
import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class AIProvider:
    """Base class for AI providers."""
    def generate(self, prompt: str, **kwargs) -> str:
        raise NotImplementedError

class OpenAICompatibleProvider(AIProvider):
    """Unified provider for all OpenAI-compatible APIs (OpenAI, Ollama, LM Studio, OpenRouter, Custom)."""
    def __init__(self, provider_name: str, api_key: Optional[str] = None, base_url: Optional[str] = None, model: Optional[str] = None):
        self.provider_name = provider_name.upper()
        self.api_key = api_key
        self.base_url = base_url
        self.model = model or "gpt-3.5-turbo"
        self.client = None
        self.is_legacy = True
        
        try:
            import openai
            # Support both legacy (<1.0.0) and modern (>=1.0.0) OpenAI SDKs
            if hasattr(openai, 'OpenAI'):
                self.is_legacy = False
                # For OpenRouter, add default headers
                extra_headers = {}
                if "openrouter" in provider_name.lower():
                    extra_headers = {
                        "HTTP-Referer": "https://github.com/TIF-AI/TIF-AI",
                        "X-Title": "TIF-AI"
                    }
                self.client = openai.OpenAI(
                    api_key=self.api_key or "noop", 
                    base_url=self.base_url,
                    default_headers=extra_headers if extra_headers else None
                )
            else:
                self.client = openai
            logger.info(f"{self.provider_name} provider initialized. Model: {self.model}")
        except ImportError:
            logger.error("OpenAI package not installed. Install with: pip install openai")

    def generate(self, prompt: str, **kwargs) -> str:
        if not self.client:
            return self._fallback(prompt)
        try:
            model_name = kwargs.get("model", self.model)
            if not self.is_legacy:
                response = self.client.chat.completions.create(
                    model=model_name,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=kwargs.get("max_tokens", 500),
                    temperature=kwargs.get("temperature", 0.7),
                )
                return response.choices[0].message.content.strip()
            else:
                # Legacy OpenAI SDK support
                self.client.api_key = self.api_key or "noop"
                if self.base_url:
                    self.client.api_base = self.base_url
                response = self.client.ChatCompletion.create(
                    model=model_name,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=kwargs.get("max_tokens", 500),
                    temperature=kwargs.get("temperature", 0.7),
                )
                return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"{self.provider_name} generation failed: {e}")
            return self._fallback(prompt)

    def _fallback(self, prompt: str) -> str:
        return f"[AI Fallback] Received prompt of length {len(prompt)}."

class AzureOpenAIProvider(AIProvider):
    """Dedicated provider for Azure OpenAI service."""
    def __init__(self, api_key: str, endpoint: str, deployment_name: str, api_version: str):
        self.api_key = api_key
        self.endpoint = endpoint
        self.deployment_name = deployment_name
        self.api_version = api_version
        self.client = None
        self.is_legacy = True
        
        try:
            import openai
            if hasattr(openai, 'AzureOpenAI'):
                self.is_legacy = False
                self.client = openai.AzureOpenAI(
                    api_key=self.api_key,
                    api_version=self.api_version,
                    azure_endpoint=self.endpoint
                )
            else:
                self.client = openai
            logger.info("Azure OpenAI provider initialized.")
        except ImportError:
            logger.error("OpenAI package not installed. Install with: pip install openai")

    def generate(self, prompt: str, **kwargs) -> str:
        if not self.client:
            return self._fallback(prompt)
        try:
            if self.is_legacy:
                self.client.api_type = "azure"
                self.client.api_key = self.api_key
                self.client.api_base = self.endpoint
                self.client.api_version = self.api_version
                response = self.client.ChatCompletion.create(
                    engine=self.deployment_name,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=kwargs.get("max_tokens", 500),
                    temperature=kwargs.get("temperature", 0.7),
                )
                return response.choices[0].message.content.strip()
            else:
                response = self.client.chat.completions.create(
                    model=self.deployment_name,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=kwargs.get("max_tokens", 500),
                    temperature=kwargs.get("temperature", 0.7),
                )
                return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Azure OpenAI generation failed: {e}")
            return self._fallback(prompt)

    def _fallback(self, prompt: str) -> str:
        return f"[AI Fallback] Received prompt of length {len(prompt)}."

class GeminiProvider(AIProvider):
    """Dedicated provider for Google Generative AI (Gemini)."""
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model or "gemini-pro"
        self.model = None
        
        if not self.api_key:
            logger.warning("Gemini API key not provided. Using fallback.")
        else:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(self.model_name)
                logger.info(f"Gemini provider initialized with model: {self.model_name}")
            except ImportError:
                logger.error("Google generativeai package not installed. Install with: pip install google-generativeai")

    def generate(self, prompt: str, **kwargs) -> str:
        if not self.model:
            return self._fallback(prompt)
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            return self._fallback(prompt)

    def _fallback(self, prompt: str) -> str:
        return f"[AI Fallback] Received prompt of length {len(prompt)}."

def get_ai_provider() -> AIProvider:
    """
    Factory function to get the AI provider based on active configuration.
    Priority: config/ai-config.json -> Environment variables (.env) -> Fallback.
    """
    from app.core.config import settings, logger

    provider = settings.AI_PROVIDER
    
    # 1. Configured via Setup Wizard
    if provider == 'openai':
        return OpenAICompatibleProvider('openai', settings.AI_API_KEY, model=settings.AI_MODEL)
    elif provider == 'gemini':
        return GeminiProvider(settings.AI_API_KEY, model=settings.AI_MODEL)
    elif provider == 'ollama':
        base_url = settings.AI_ENDPOINT
        if base_url and not base_url.endswith('/v1'):
            base_url = f"{base_url.rstrip('/')}/v1"
        return OpenAICompatibleProvider('ollama', api_key="ollama", base_url=base_url, model=settings.AI_MODEL)
    elif provider == 'lmstudio':
        base_url = settings.AI_ENDPOINT
        if base_url and not base_url.endswith('/v1'):
            base_url = f"{base_url.rstrip('/')}/v1"
        return OpenAICompatibleProvider('lmstudio', api_key="lmstudio", base_url=base_url, model=settings.AI_MODEL)
    elif provider == 'openrouter':
        return OpenAICompatibleProvider('openrouter', settings.AI_API_KEY, base_url="https://openrouter.ai/api/v1", model=settings.AI_MODEL)
    elif provider == 'azure':
        return AzureOpenAIProvider(
            api_key=settings.AI_API_KEY,
            endpoint=settings.AI_ENDPOINT,
            deployment_name=settings.AI_DEPLOYMENT_NAME,
            api_version=settings.AI_API_VERSION or "2024-02-15-preview"
        )
    elif provider == 'custom':
        return OpenAICompatibleProvider('custom', settings.AI_API_KEY, base_url=settings.AI_ENDPOINT, model=settings.AI_MODEL)
        
    # 2. Fallback to Environment Variables (Backward compatibility)
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        return OpenAICompatibleProvider('openai', openai_key)
    
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        return GeminiProvider(gemini_key)
        
    # 3. Default Fallback Provider
    class FallbackProvider(AIProvider):
        def generate(self, prompt: str, **kwargs) -> str:
            return f"[AI Fallback] Received prompt of length {len(prompt)}."
            
    return FallbackProvider()

