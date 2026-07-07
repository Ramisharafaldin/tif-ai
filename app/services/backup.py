"""
Backup & Restore Engine for TIF-AI DuckDB database.
Supports creating, listing, and restoring database backups.
"""
import os
import json
import shutil
import datetime
from pathlib import Path
from typing import Optional, List
from app.core.config import logger

DATA_DIR = Path(__file__).resolve().parents[2] / 'data'
BACKUP_DIR = DATA_DIR / 'backups'
INDEX_FILE = BACKUP_DIR / 'index.json'
DB_PATH = DATA_DIR / 'tifai.duckdb'


def _ensure_backup_dir():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)


def _load_index() -> dict:
    _ensure_backup_dir()
    if INDEX_FILE.exists():
        try:
            with open(INDEX_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            pass
    return {'backups': []}


def _save_index(index: dict):
    _ensure_backup_dir()
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)


def _generate_id() -> str:
    ts = datetime.datetime.utcnow()
    return ts.strftime('backup_%Y%m%d_%H%M%S_%f')


def _get_db_size() -> Optional[int]:
    if DB_PATH.exists():
        return DB_PATH.stat().st_size
    return None


def create_backup(description: str = '', include_csv: bool = False) -> dict:
    """
    Create a full backup of the DuckDB database using EXPORT DATABASE.
    Returns metadata dict for the created backup.
    """
    from app.data.db import get_duckdb_connection

    backup_id = _generate_id()
    backup_path = BACKUP_DIR / backup_id
    _ensure_backup_dir()

    if backup_path.exists():
        shutil.rmtree(str(backup_path))

    try:
        con = get_duckdb_connection()
        con.execute(f"EXPORT DATABASE '{backup_path}' (FORMAT PARQUET)")
        con.close()

        # Optionally copy CSV data files
        if include_csv:
            csv_backup = backup_path / 'csv'
            csv_backup.mkdir(exist_ok=True)
            for f in ['inventory_data.csv', 'sales_data.csv']:
                src = DATA_DIR / f
                if src.exists():
                    shutil.copy2(str(src), str(csv_backup / f))

        size = sum(f.stat().st_size for f in backup_path.rglob('*') if f.is_file())
        timestamp = datetime.datetime.utcnow().isoformat() + 'Z'

        meta = {
            'id': backup_id,
            'timestamp': timestamp,
            'description': description,
            'size_bytes': size,
            'path': str(backup_path),
            'include_csv': include_csv,
        }

        index = _load_index()
        index['backups'].append(meta)
        _save_index(index)

        logger.info(f"Backup created: {backup_id} ({size} bytes)")
        return meta

    except Exception as e:
        logger.error(f"Backup failed: {e}")
        if backup_path.exists():
            shutil.rmtree(str(backup_path))
        raise


def list_backups() -> List[dict]:
    """List all available backups with metadata."""
    index = _load_index()
    # Verify backups still exist on disk
    valid = []
    for b in index.get('backups', []):
        p = Path(b.get('path', ''))
        if p.exists():
            valid.append(b)
        else:
            logger.warning(f"Backup missing from disk: {b.get('id')}")
    # Update index if any were missing
    if len(valid) != len(index.get('backups', [])):
        index['backups'] = valid
        _save_index(index)
    return sorted(valid, key=lambda x: x.get('timestamp', ''), reverse=True)


def get_backup(backup_id: str) -> Optional[dict]:
    """Get metadata for a specific backup."""
    for b in list_backups():
        if b['id'] == backup_id:
            return b
    return None


def delete_backup(backup_id: str) -> bool:
    """Delete a backup by ID. Returns True if successful."""
    index = _load_index()
    before = len(index['backups'])
    remaining = [b for b in index['backups'] if b['id'] != backup_id]
    removed = len(index['backups']) - len(remaining)

    if removed == 0:
        return False

    # Find the backup to delete its files
    for b in index['backups']:
        if b['id'] == backup_id:
            p = Path(b.get('path', ''))
            if p.exists():
                shutil.rmtree(str(p))
            break

    index['backups'] = remaining
    _save_index(index)
    return True


def restore_backup(backup_id: str) -> dict:
    """
    Restore a backup by ID.
    Drops all existing tables and imports from the backup.
    Returns a status dict.
    """
    from app.data.db import get_duckdb_connection, init_db

    meta = get_backup(backup_id)
    if not meta:
        raise ValueError(f"Backup not found: {backup_id}")

    backup_path = Path(meta['path'])
    if not backup_path.exists():
        raise FileNotFoundError(f"Backup directory missing: {backup_path}")

    con = get_duckdb_connection()
    try:
        # Drop all existing tables
        tables = ['inventory_data', 'sales_data', 'audit_log', 'system_settings', 'products', 'users']
        for t in tables:
            con.execute(f"DROP TABLE IF EXISTS {t}")

        # Import from backup
        con.execute(f"IMPORT DATABASE '{backup_path}'")
        con.close()

        # Restore CSV data files if backed up
        csv_backup = backup_path / 'csv'
        if csv_backup.exists():
            for f in ['inventory_data.csv', 'sales_data.csv']:
                src = csv_backup / f
                dst = DATA_DIR / f
                if src.exists():
                    shutil.copy2(str(src), str(dst))

        logger.info(f"Backup restored: {backup_id}")
        return {'status': 'ok', 'message': f'Backup {backup_id} restored successfully', 'backup_id': backup_id}

    except Exception as e:
        logger.error(f"Restore failed: {e}")
        # Try to re-initialize tables
        try:
            init_db()
        except Exception:
            pass
        raise


def get_backup_size_info() -> dict:
    """Get size info for the current database and all backups."""
    db_size = _get_db_size()
    backups = list_backups()
    total_backup_size = sum(b.get('size_bytes', 0) for b in backups)
    return {
        'database_size_bytes': db_size,
        'backup_count': len(backups),
        'total_backup_size_bytes': total_backup_size,
        'backup_directory': str(BACKUP_DIR),
    }
