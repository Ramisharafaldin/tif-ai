import warnings
warnings.filterwarnings('ignore')

from fastapi.testclient import TestClient
from app.main import app
from app.data.db import init_db

client = TestClient(app)

def setup_module():
    init_db()
    # Clean up test users from previous runs
    from app.data.db import get_duckdb_connection
    con = get_duckdb_connection()
    con.execute("DELETE FROM users WHERE username LIKE 'testuser%' OR username LIKE 'admin%'")
    con.close()

def test_health():
    r = client.get('/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'ok'

def test_signup():
    r = client.post('/api/v1/auth/signup', json={'username': 'testuser', 'email': 'user@test.com', 'password': 'testpass123', 'role': 'viewer'})
    assert r.status_code == 201
    data = r.json()
    assert data['username'] == 'testuser'
    assert data['role'] == 'viewer'
    assert data['is_active'] is True

def test_signup_duplicate():
    r = client.post('/api/v1/auth/signup', json={'username': 'testuser', 'email': 'x@y.com', 'password': 'x'})
    assert r.status_code == 400
    assert 'Username already taken' in r.text

def test_login():
    r = client.post('/api/v1/auth/login', json={'username': 'testuser', 'password': 'testpass123'})
    assert r.status_code == 200
    data = r.json()
    assert 'access_token' in data
    assert data['token_type'] == 'bearer'

def test_login_wrong_password():
    r = client.post('/api/v1/auth/login', json={'username': 'testuser', 'password': 'wrongpass'})
    assert r.status_code == 401

def test_login_wrong_user():
    r = client.post('/api/v1/auth/login', json={'username': 'nonexistent', 'password': 'x'})
    assert r.status_code == 401

def test_me_authenticated():
    r = client.post('/api/v1/auth/login', json={'username': 'testuser', 'password': 'testpass123'})
    token = r.json()['access_token']
    r = client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {token}'})
    assert r.status_code == 200
    assert r.json()['username'] == 'testuser'

def test_me_no_token():
    r = client.get('/api/v1/auth/me')
    assert r.status_code == 401

def test_me_invalid_token():
    r = client.get('/api/v1/auth/me', headers={'Authorization': 'Bearer invalidtoken123'})
    assert r.status_code == 401

def test_signup_admin_role():
    r = client.post('/api/v1/auth/signup', json={'username': 'admin2', 'email': 'admin2@test.com', 'password': 'adminpass', 'role': 'admin', 'full_name': 'Admin User'})
    assert r.status_code == 201
    assert r.json()['role'] == 'admin'
    assert r.json()['full_name'] == 'Admin User'
