from fastapi import FastAPI
from app.core.logging import setup_logging
from app.core.config import settings
from app.api import api_router
from app.data.db import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f'{settings.API_V1_STR}/openapi.json'
)

@app.on_event("startup")
async def startup_event():
    init_db()
    setup_logging(settings.LOG_LEVEL.upper())

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get('/health', tags=['health'])
async def health_check():
    return {'status': 'ok'}

