from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    question: str
    lang: str = 'en'

class ChatResponse(BaseModel):
    answer: str
    agent: str = 'AiChatAgent'
