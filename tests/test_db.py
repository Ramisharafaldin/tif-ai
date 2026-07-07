import pytest
from app.data.db import init_db, get_system_setting, set_system_setting, get_duckdb_connection

class TestDatabaseInit:
    def test_init_db_creates_tables(self):
        init_db()
        con = get_duckdb_connection()
        tables = con.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'main'").fetchall()
        table_names = [t[0] for t in tables]
        assert 'inventory_data' in table_names
        assert 'sales_data' in table_names
        assert 'audit_log' in table_names
        assert 'system_settings' in table_names
        con.close()

class TestSystemSettings:
    def test_set_and_get_setting(self):
        set_system_setting('test_key', 'test_value', 'A test setting')
        value = get_system_setting('test_key')
        assert value == 'test_value'

    def test_get_nonexistent_setting_returns_default(self):
        value = get_system_setting('nonexistent_key', 'default_val')
        assert value == 'default_val'

    def test_update_existing_setting(self):
        set_system_setting('update_key', 'value1')
        set_system_setting('update_key', 'value2', 'Updated')
        value = get_system_setting('update_key')
        assert value == 'value2'
