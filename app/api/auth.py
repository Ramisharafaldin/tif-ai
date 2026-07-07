from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import UserCreate, UserResponse, Token, LoginRequest
from app.services.auth import create_user, authenticate, create_access_token, get_user_by_username, get_current_user

router = APIRouter(tags=['auth'])

@router.post('/auth/signup', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate):
    existing = get_user_by_username(payload.username)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Username already taken')
    user = create_user(username=payload.username, email=payload.email, password=payload.password, full_name=payload.full_name, role=payload.role)
    return user

@router.post('/auth/login', response_model=Token)
async def login(payload: LoginRequest):
    user = authenticate(payload.username, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid username or password')
    token = create_access_token(data={'sub': user['username'], 'role': user['role']})
    return Token(access_token=token)

@router.get('/auth/me', response_model=UserResponse)
async def me(user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Not authenticated')
    return UserResponse(id=user['id'], username=user['username'], email=user['email'], full_name=user['full_name'], role=user['role'], is_active=user['is_active'], created_at=user['created_at'])
