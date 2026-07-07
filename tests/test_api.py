import warnings
warnings.filterwarnings('ignore')

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.data.db import init_db

def setup_module():
    init_db()

client = TestClient(app)

class TestHealthEndpoint:
    def test_health_returns_ok(self):
        response = client.get('/health')
        assert response.status_code == 200
        assert response.json() == {'status': 'ok'}

    def test_health_returns_json(self):
        response = client.get('/health')
        assert response.headers['content-type'] == 'application/json'

class TestDashboardEndpoints:
    def test_get_dashboard_returns_json(self):
        response = client.get('/api/v1/dashboard')
        assert response.status_code == 200
        data = response.json()
        assert 'agent' in data
        assert 'execution_time_ms' in data

    def test_post_dashboard_analyze_accepts_empty(self):
        response = client.post('/api/v1/dashboard/analyze', json={})
        assert response.status_code == 200
        data = response.json()
        assert 'agent' in data

    def test_post_dashboard_analyze_with_filters(self):
        payload = {
            'branch_id': 'RUH',
            'include_kpis': True,
            'include_alerts': True,
            'include_insights': True,
        }
        response = client.post('/api/v1/dashboard/analyze', json=payload)
        assert response.status_code == 200

class TestInventoryEndpoints:
    def test_get_inventory_returns_json(self):
        response = client.get('/api/v1/inventory')
        assert response.status_code == 200
        data = response.json()
        assert 'summary' in data or 'error' in data

    def test_post_inventory_analyze(self):
        response = client.post('/api/v1/inventory/analyze', json={})
        assert response.status_code == 200

class TestForecastingEndpoints:
    def test_get_forecasting_returns_json(self):
        response = client.get('/api/v1/forecasting')
        assert response.status_code == 200

    def test_post_forecasting_run(self):
        response = client.post('/api/v1/forecasting/run', json={'period_days': 30})
        assert response.status_code == 200
        data = response.json()
        assert 'period' in data or 'error' in data

class TestTransfersEndpoints:
    def test_get_transfers_returns_json(self):
        response = client.get('/api/v1/transfers')
        assert response.status_code == 200

    def test_post_transfers_analyze(self):
        response = client.post('/api/v1/transfers/analyze', json={})
        assert response.status_code == 200

class TestDataEndpoints:
    def test_get_data_status_returns_json(self):
        response = client.get('/api/v1/data/status')
        assert response.status_code == 200

    def test_post_data_reload(self):
        response = client.post('/api/v1/data/reload')
        assert response.status_code == 200
        assert response.json()['status'] == 'ok'

class TestAgentsEndpoint:
    def test_get_agents_status(self):
        response = client.get('/api/v1/agents/status')
        assert response.status_code == 200
        data = response.json()
        assert 'agents' in data
        assert 'total_agents' in data
        assert data['total_agents'] == 7

class TestOpenAPI:
    def test_openapi_schema(self):
        response = client.get('/api/v1/openapi.json')
        assert response.status_code == 200
        schema = response.json()
        assert 'paths' in schema
        assert '/api/v1/dashboard/analyze' in schema['paths']
