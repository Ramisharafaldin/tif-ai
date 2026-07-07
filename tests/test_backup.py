import pytest
import shutil
from pathlib import Path
from app.services.backup import (
    create_backup, list_backups, get_backup,
    delete_backup, get_backup_size_info,
)
from app.data.db import get_duckdb_connection, init_db

DATA_DIR = Path(__file__).resolve().parents[1] / 'data'
BACKUP_DIR = DATA_DIR / 'backups'


@pytest.fixture(autouse=True)
def clean_backups():
    """Clean up backups before and after each test."""
    if BACKUP_DIR.exists():
        shutil.rmtree(str(BACKUP_DIR))
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    init_db()  # Ensure tables exist
    yield
    if BACKUP_DIR.exists():
        shutil.rmtree(str(BACKUP_DIR))


class TestCreateBackup:
    def test_creates_backup_with_metadata(self):
        meta = create_backup(description='test backup')
        assert 'id' in meta
        assert meta['description'] == 'test backup'
        assert meta['size_bytes'] > 0
        assert 'timestamp' in meta
        assert meta['include_csv'] is False

    def test_backup_directory_exists(self):
        meta = create_backup()
        path = Path(meta['path'])
        assert path.exists()
        assert path.is_dir()

    def test_backup_id_format(self):
        meta = create_backup()
        assert meta['id'].startswith('backup_')

    def test_creates_valid_schema_files(self):
        meta = create_backup()
        path = Path(meta['path'])
        # DuckDB EXPORT DATABASE creates schema.sql and data parquet files
        files = list(path.rglob('*'))
        assert len(files) > 0

    def test_multiple_backups(self):
        m1 = create_backup('first')
        m2 = create_backup('second')
        assert m1['id'] != m2['id'] or m1['timestamp'] != m2['timestamp']

    def test_include_csv(self):
        meta = create_backup(include_csv=True)
        csv_dir = Path(meta['path']) / 'csv'
        assert csv_dir.exists()


class TestListBackups:
    def test_list_empty(self):
        backups = list_backups()
        assert backups == []

    def test_list_single_backup(self):
        create_backup('test')
        backups = list_backups()
        assert len(backups) == 1
        assert backups[0]['description'] == 'test'

    def test_list_ordered_by_timestamp_desc(self):
        create_backup('first')
        create_backup('second')
        backups = list_backups()
        assert len(backups) == 2
        assert backups[0]['description'] == 'second'
        assert backups[1]['description'] == 'first'


class TestGetBackup:
    def test_get_existing(self):
        meta = create_backup('find me')
        found = get_backup(meta['id'])
        assert found is not None
        assert found['description'] == 'find me'

    def test_get_missing(self):
        found = get_backup('nonexistent')
        assert found is None


class TestDeleteBackup:
    def test_delete_existing(self):
        meta = create_backup('delete me')
        path = Path(meta['path'])
        assert path.exists()
        result = delete_backup(meta['id'])
        assert result is True
        assert not path.exists()
        assert len(list_backups()) == 0

    def test_delete_missing(self):
        result = delete_backup('nonexistent')
        assert result is False


class TestBackupInfo:
    def test_info_with_no_backups(self):
        info = get_backup_size_info()
        assert info['backup_count'] == 0
        assert info['total_backup_size_bytes'] == 0
        assert info['backup_directory'] == str(BACKUP_DIR)

    def test_info_with_backups(self):
        create_backup('test')
        info = get_backup_size_info()
        assert info['backup_count'] == 1
        assert info['total_backup_size_bytes'] > 0


class TestBackupIntegration:
    def test_create_then_list_then_delete(self):
        c1 = create_backup('cycle')
        assert len(list_backups()) == 1
        assert get_backup(c1['id']) is not None
        delete_backup(c1['id'])
        assert len(list_backups()) == 0
        assert get_backup(c1['id']) is None

    def test_index_file_created(self):
        create_backup('test')
        index_file = BACKUP_DIR / 'index.json'
        assert index_file.exists()
