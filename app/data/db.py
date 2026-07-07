import os
from typing import Optional
from pathlib import Path
import duckdb
import pandas as pd
from app.core.config import settings

DATA_DIR = Path(__file__).resolve().parents[2] / 'data'

def get_duckdb_connection(db_path: str = None):
    """Return a DuckDB connection (creates if not exists)."""
    if db_path is None:
        db_path = str(DATA_DIR / 'tifai.duckdb')
    # Ensure directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    con = duckdb.connect(database=db_path, read_only=False)
    return con

def init_db():
    """Initialize required tables if they don't exist."""
    con = get_duckdb_connection()
    # Inventory table
    con.execute("""
    CREATE TABLE IF NOT EXISTS inventory_data (
        branch_code VARCHAR,
        branch_name VARCHAR,
        product_code VARCHAR,
        product_name VARCHAR,
        category VARCHAR,
        unit_cost DOUBLE,
        unit_price DOUBLE,
        opening_stock INTEGER,
        purchases INTEGER,
        sales INTEGER,
        adjustments INTEGER,
        closing_stock INTEGER,
        date DATE,
        upload_timestamp TIMESTAMP,
        upload_batch_id VARCHAR
    )
    """)
    # Sales table
    con.execute("""
    CREATE TABLE IF NOT EXISTS sales_data (
        branch_code VARCHAR,
        product_code VARCHAR,
        date DATE,
        quantity_sold INTEGER,
        unit_price DOUBLE,
        discount_amount DOUBLE,
        customer_type VARCHAR,
        upload_timestamp TIMESTAMP,
        upload_batch_id VARCHAR
    )
    """)
    # Audit log table
    con.execute("""
    CREATE TABLE IF NOT EXISTS audit_log (
        id UUID PRIMARY KEY DEFAULT uuid(),
        agent_name VARCHAR,
        input_hash VARCHAR,
        output_summary VARCHAR,
        execution_time_ms DOUBLE,
        success BOOLEAN,
        timestamp TIMESTAMP DEFAULT now()
    )
    """)
    # System settings table (key-value)
    con.execute("""
    CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR PRIMARY KEY,
        value VARCHAR,
        description VARCHAR,
        updated_at TIMESTAMP DEFAULT now()
    )
    """)
    # Products master table (CRUD)
    con.execute("""
    CREATE TABLE IF NOT EXISTS products (
        product_code VARCHAR PRIMARY KEY,
        product_name VARCHAR,
        category VARCHAR,
        unit_cost DOUBLE,
        unit_price DOUBLE,
        created_at VARCHAR,
        updated_at VARCHAR
    )
    """)
    # Users table (authentication)
    con.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY,
        username VARCHAR UNIQUE,
        email VARCHAR,
        password_hash VARCHAR,
        full_name VARCHAR,
        role VARCHAR DEFAULT 'viewer',
        is_active BOOLEAN DEFAULT TRUE,
        created_at VARCHAR
    )
    """)
    con.close()

def load_inventory_data(start_date: str = None, end_date: str = None) -> pd.DataFrame:
    csv_path = DATA_DIR / 'inventory_data.csv'
    if not csv_path.exists():
        return pd.DataFrame()
    df = pd.read_csv(csv_path)
    con = get_duckdb_connection()
    con.execute('DELETE FROM inventory_data')
    con.register('df_temp', df)
    con.execute('INSERT INTO inventory_data SELECT * FROM df_temp')
    con.unregister('df_temp')
    query = 'SELECT * FROM inventory_data'
    params = []
    if start_date or end_date:
        conditions = []
        if start_date:
            conditions.append('date >= ?')
            params.append(start_date)
        if end_date:
            conditions.append('date <= ?')
            params.append(end_date)
        query += ' WHERE ' + ' AND '.join(conditions)
    result = con.execute(query, params).fetchdf()
    con.close()
    return result

def load_sales_data(start_date: str = None, end_date: str = None) -> pd.DataFrame:
    csv_path = DATA_DIR / 'sales_data.csv'
    if not csv_path.exists():
        return pd.DataFrame()
    df = pd.read_csv(csv_path)
    con = get_duckdb_connection()
    con.execute('DELETE FROM sales_data')
    con.register('df_temp', df)
    con.execute('INSERT INTO sales_data SELECT * FROM df_temp')
    con.unregister('df_temp')
    query = 'SELECT * FROM sales_data'
    params = []
    if start_date or end_date:
        conditions = []
        if start_date:
            conditions.append('date >= ?')
            params.append(start_date)
        if end_date:
            conditions.append('date <= ?')
            params.append(end_date)
        query += ' WHERE ' + ' AND '.join(conditions)
    result = con.execute(query, params).fetchdf()
    con.close()
    return result

def get_inventory(filters: dict = None) -> pd.DataFrame:
    """Fetch inventory with optional filters."""
    con = get_duckdb_connection()
    query = 'SELECT * FROM inventory_data'
    if filters:
        # simple implementation: equality filters
        conditions = []
        params = []
        for k, v in filters.items():
            conditions.append(f"{k} = ?")
            params.append(v)
        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)
    df = con.execute(query, params).fetchdf()
    con.close()
    return df

def get_sales(filters: dict = None) -> pd.DataFrame:
    """Fetch sales with optional filters."""
    con = get_duckdb_connection()
    query = 'SELECT * FROM sales_data'
    if filters:
        conditions = []
        params = []
        for k, v in filters.items():
            conditions.append(f"{k} = ?")
            params.append(v)
        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)
    df = con.execute(query, params).fetchdf()
    con.close()
    return df

def get_all_products() -> list:
    con = get_duckdb_connection()
    rows = con.execute("SELECT product_code, product_name, category, unit_cost, unit_price, created_at, updated_at FROM products ORDER BY product_code").fetchall()
    con.close()
    return [{'product_code': r[0], 'product_name': r[1], 'category': r[2], 'unit_cost': r[3], 'unit_price': r[4], 'created_at': r[5], 'updated_at': r[6]} for r in rows]

def create_product(code: str, name: str, category: str, unit_cost: float, unit_price: float) -> dict:
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).isoformat()
    con = get_duckdb_connection()
    con.execute("INSERT INTO products (product_code, product_name, category, unit_cost, unit_price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [code, name, category, unit_cost, unit_price, now, now])
    con.close()
    return {'product_code': code, 'product_name': name, 'category': category, 'unit_cost': unit_cost, 'unit_price': unit_price, 'created_at': now, 'updated_at': now}

def update_product(code: str, name: str = None, category: str = None, unit_cost: float = None, unit_price: float = None) -> Optional[dict]:
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).isoformat()
    con = get_duckdb_connection()
    existing = con.execute("SELECT * FROM products WHERE product_code = ?", [code]).fetchone()
    if not existing:
        con.close()
        return None
    new_name = name if name is not None else existing[1]
    new_cat = category if category is not None else existing[2]
    new_cost = unit_cost if unit_cost is not None else existing[3]
    new_price = unit_price if unit_price is not None else existing[4]
    con.execute("UPDATE products SET product_name = ?, category = ?, unit_cost = ?, unit_price = ?, updated_at = ? WHERE product_code = ?", [new_name, new_cat, new_cost, new_price, now, code])
    con.close()
    return {'product_code': code, 'product_name': new_name, 'category': new_cat, 'unit_cost': new_cost, 'unit_price': new_price, 'updated_at': now}

def delete_product(code: str) -> bool:
    con = get_duckdb_connection()
    existing = con.execute("SELECT product_code FROM products WHERE product_code = ?", [code]).fetchone()
    if not existing:
        con.close()
        return False
    con.execute("DELETE FROM products WHERE product_code = ?", [code])
    con.close()
    return True

def get_all_settings() -> dict:
    con = get_duckdb_connection()
    rows = con.execute('SELECT key, value, description FROM system_settings').fetchall()
    con.close()
    return {r[0]: {'value': r[1], 'description': r[2]} for r in rows}

def log_agent_invocation(agent_name: str, input_dict: dict, output_dict: dict, execution_time_ms: float, success: bool = True):
    """Log an agent call to audit_log."""
    import hashlib, json
    input_str = json.dumps(input_dict, sort_keys=True)
    input_hash = hashlib.sha256(input_str.encode()).hexdigest()
    output_str = json.dumps(output_dict, sort_keys=True)
    output_summary = output_str[:200]  # truncate
    con = get_duckdb_connection()
    con.execute("""
    INSERT INTO audit_log (agent_name, input_hash, output_summary, execution_time_ms, success)
    VALUES (?, ?, ?, ?, ?)
    """, (agent_name, input_hash, output_summary, execution_time_ms, success))
    con.close()

def get_system_setting(key: str, default=None):
    con = get_duckdb_connection()
    row = con.execute('SELECT value FROM system_settings WHERE key = ?', (key,)).fetchone()
    con.close()
    if row:
        return row[0]
    return default

def set_system_setting(key: str, value: str, description: str = None):
    con = get_duckdb_connection()
    con.execute("""
    INSERT INTO system_settings (key, value, description)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description, updated_at = now()
    """, (key, value, description))
    con.close()
