from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None
    role: str = 'viewer'

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'

class LoginRequest(BaseModel):
    username: str
    password: str
