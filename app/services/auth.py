import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.data.db import get_duckdb_connection

SECRET_KEY = 'tif-ai-jwt-secret-change-in-production'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

def get_user_by_username(username: str) -> Optional[dict]:
    con = get_duckdb_connection()
    try:
        result = con.execute("SELECT id, username, email, password_hash, full_name, role, is_active, created_at FROM users WHERE username = ?", [username]).fetchone()
        if not result:
            return None
        return {'id': result[0], 'username': result[1], 'email': result[2], 'password_hash': result[3], 'full_name': result[4], 'role': result[5], 'is_active': result[6], 'created_at': result[7]}
    finally:
        con.close()

def create_user(username: str, email: str, password: str, full_name: Optional[str] = None, role: str = 'viewer') -> dict:
    con = get_duckdb_connection()
    try:
        uid = str(uuid.uuid4())
        pwd_hash = hash_password(password)
        now = datetime.now(timezone.utc).isoformat()
        con.execute("INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, TRUE, ?)", [uid, username, email, pwd_hash, full_name, role, now])
        return {'id': uid, 'username': username, 'email': email, 'full_name': full_name, 'role': role, 'is_active': True, 'created_at': now}
    finally:
        con.close()

def authenticate(username: str, password: str) -> Optional[dict]:
    user = get_user_by_username(username)
    if not user or not verify_password(password, user['password_hash']):
        return None
    return user

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[dict]:
    if credentials is None:
        return None
    payload = decode_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token')
    username = payload.get('sub')
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token')
    user = get_user_by_username(username)
    if not user or not user['is_active']:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found or inactive')
    return user

async def require_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    user = await get_current_user(credentials)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication required')
    return user

def require_role(*allowed_roles: str):
    async def role_checker(user: dict = Depends(require_user)) -> dict:
        if user['role'] not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f'Role "{user["role"]}" not allowed. Required: {", ".join(allowed_roles)}')
        return user
    return role_checker
