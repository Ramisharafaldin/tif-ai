import os
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
    con.close()

def load_inventory_data() -> pd.DataFrame:
    """Load inventory data from CSV into DuckDB and return as DataFrame."""
    csv_path = DATA_DIR / 'inventory_data.csv'
    if not csv_path.exists():
        return pd.DataFrame()
    df = pd.read_csv(csv_path)
    con = get_duckdb_connection()
    # Replace table
    con.execute('DELETE FROM inventory_data')
    con.register('df_temp', df)
    con.execute('INSERT INTO inventory_data SELECT * FROM df_temp')
    con.unregister('df_temp')
    # Return data
    result = con.execute('SELECT * FROM inventory_data').fetchdf()
    con.close()
    return result

def load_sales_data() -> pd.DataFrame:
    """Load sales data from CSV into DuckDB and return as DataFrame."""
    csv_path = DATA_DIR / 'sales_data.csv'
    if not csv_path.exists():
        return pd.DataFrame()
    df = pd.read_csv(csv_path)
    con = get_duckdb_connection()
    con.execute('DELETE FROM sales_data')
    con.register('df_temp', df)
    con.execute('INSERT INTO sales_data SELECT * FROM df_temp')
    con.unregister('df_temp')
    result = con.execute('SELECT * FROM sales_data').fetchdf()
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
