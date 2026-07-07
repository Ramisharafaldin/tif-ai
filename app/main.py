from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from app.core.logging import setup_logging
from app.core.config import settings
from app.api import api_router, auth_router, backup_router
from app.data.db import init_db
from app.services.notifications import connected_clients

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    setup_logging(settings.LOG_LEVEL.upper())
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description='AI-powered inventory management and logistics platform. Supports 7 AI providers, real-time WebSocket notifications, JWT authentication, and full inventory CRUD with role-based access control.',
    version='2.0.0',
    openapi_url=f'{settings.API_V1_STR}/openapi.json',
    docs_url='/docs',
    redoc_url='/redoc',
    lifespan=lifespan,
)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(backup_router, prefix=settings.API_V1_STR)

@app.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        connected_clients.discard(websocket)

@app.get('/health', tags=['health'])
async def health_check():
    return {'status': 'ok'}

