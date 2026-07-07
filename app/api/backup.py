from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.backup import (
    create_backup, list_backups, get_backup,
    delete_backup, restore_backup, get_backup_size_info,
)
from app.services.auth import require_role

router = APIRouter(prefix='/backup', tags=['backup'])


class CreateBackupRequest(BaseModel):
    description: str = ''
    include_csv: bool = False


class RestoreRequest(BaseModel):
    backup_id: str


@router.get('')
async def list_all_backups():
    """List all available backups."""
    return {'backups': list_backups()}


@router.post('')
async def create_new_backup(payload: CreateBackupRequest, user: dict = Depends(require_role('admin'))):
    """Create a new backup."""
    try:
        result = create_backup(description=payload.description, include_csv=payload.include_csv)
        return {'status': 'ok', 'backup': result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/info')
async def backup_info():
    """Get backup storage info."""
    return get_backup_size_info()


@router.get('/{backup_id}')
async def get_backup_details(backup_id: str):
    """Get details for a specific backup."""
    meta = get_backup(backup_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f'Backup not found: {backup_id}')
    return meta


@router.delete('/{backup_id}')
async def remove_backup(backup_id: str, user: dict = Depends(require_role('admin'))):
    """Delete a backup."""
    if not delete_backup(backup_id):
        raise HTTPException(status_code=404, detail=f'Backup not found: {backup_id}')
    return {'status': 'deleted', 'backup_id': backup_id}


@router.post('/restore')
async def restore_from_backup(payload: RestoreRequest, user: dict = Depends(require_role('admin'))):
    """Restore database from a backup."""
    try:
        result = restore_backup(payload.backup_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
