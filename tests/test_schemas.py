import pytest
from app.schemas.dashboard import DashboardAnalyzeRequest, DashboardAnalyzeResponse, KPIItem, AlertItem, InsightItem
from app.schemas.inventory import InventoryAnalyzeRequest, InventoryAnalyzeResponse, InventoryItem, InventorySummary
from app.schemas.forecasting import ForecastingRunRequest, ForecastingRunResponse, ForecastItem, ForecastPeriod
from app.schemas.transfers import TransfersAnalyzeRequest, TransfersAnalyzeResponse, TransferRecommendation
from app.schemas.data_management import DataStatusResponse, DataStatus, DataQualityIssue

class TestDashboardSchemas:
    def test_dashboard_request_defaults(self):
        req = DashboardAnalyzeRequest()
        assert req.include_kpis is True
        assert req.include_alerts is True
        assert req.include_insights is True
        assert req.branch_id is None

    def test_dashboard_request_with_branch(self):
        req = DashboardAnalyzeRequest(branch_id='RUH', include_kpis=False)
        assert req.branch_id == 'RUH'
        assert req.include_kpis is False

    def test_kpi_item_creation(self):
        kpi = KPIItem(name='test', value=100, format='number', trend='up', explanation='test')
        assert kpi.name == 'test'
        assert kpi.value == 100

    def test_alert_item_creation(self):
        alert = AlertItem(type='warning', severity='high', entity='inv', message='test', recommended_action='fix')
        assert alert.severity == 'high'

    def test_insight_item_creation(self):
        insight = InsightItem(title='test', description='desc', confidence=0.85, recommended_action='do')
        assert 0 <= insight.confidence <= 1

class TestInventorySchemas:
    def test_inventory_request(self):
        req = InventoryAnalyzeRequest(branch_id='RUH')
        assert req.branch_id == 'RUH'

    def test_inventory_item_status(self):
        item = InventoryItem(product_code='P1', product_name='Test', category='Cat', branch_code='B1', branch_name='Branch1', closing_stock=10, unit_cost=50.0, stock_value=500.0, status='normal')
        assert item.status == 'normal'

class TestForecastingSchemas:
    def test_forecast_request_default_period(self):
        req = ForecastingRunRequest()
        assert req.period_days == 30

    def test_forecast_request_custom_period(self):
        req = ForecastingRunRequest(period_days=60)
        assert req.period_days == 60

class TestTransfersSchemas:
    def test_transfer_recommendation_priority(self):
        rec = TransferRecommendation(product_code='P1', product_name='Test', from_branch='A', to_branch='B', quantity=10, reason='test', priority='high')
        assert rec.priority == 'high'

class TestDataManagementSchemas:
    def test_data_status_fields(self):
        status = DataStatus(inventory_rows=100, sales_rows=200, inventory_columns=15, sales_columns=9, has_inventory_data=True, has_sales_data=True, last_upload='2025-01-01')
        assert status.inventory_rows == 100
        assert status.has_inventory_data is True
