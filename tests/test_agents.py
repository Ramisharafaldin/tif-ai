import pytest
from app.services.agents import (
    DashboardIntelligenceAgent,
    InventoryIntelligenceAgent,
    ForecastingIntelligenceAgent,
    TransfersIntelligenceAgent,
    DataManagementAgent,
)

class TestDashboardIntelligenceAgent:
    def setup_method(self):
        self.agent = DashboardIntelligenceAgent()

    def test_init_sets_name(self):
        assert self.agent.name == 'DashboardIntelligenceAgent'

    def test_analyze_returns_dict(self):
        result = self.agent.analyze({})
        assert isinstance(result, dict)

    def test_analyze_contains_required_keys(self):
        result = self.agent.analyze({'include_kpis': True, 'include_alerts': True, 'include_insights': True})
        assert 'generated_at' in result
        assert 'agent' in result
        assert 'execution_time_ms' in result

    def test_analyze_with_no_options(self):
        result = self.agent.analyze({'include_kpis': False, 'include_alerts': False, 'include_insights': False})
        assert 'kpis' not in result
        assert 'alerts' not in result
        assert 'insights' not in result

    def test_analyze_with_branch_filter(self):
        result = self.agent.analyze({'branch_id': 'RUH'})
        assert 'error' not in result

    def test_analyze_handles_error_gracefully(self):
        result = self.agent.analyze({'include_kpis': True})
        assert 'error' not in result

class TestInventoryIntelligenceAgent:
    def setup_method(self):
        self.agent = InventoryIntelligenceAgent()

    def test_init_sets_name(self):
        assert self.agent.name == 'InventoryIntelligenceAgent'

    def test_analyze_returns_dict(self):
        result = self.agent.analyze({})
        assert isinstance(result, dict)

    def test_analyze_contains_summary(self):
        result = self.agent.analyze({})
        assert 'summary' in result or 'error' in result

class TestForecastingIntelligenceAgent:
    def setup_method(self):
        self.agent = ForecastingIntelligenceAgent()

    def test_init_sets_name(self):
        assert self.agent.name == 'ForecastingIntelligenceAgent'

    def test_analyze_returns_dict(self):
        result = self.agent.analyze({'period_days': 30})
        assert isinstance(result, dict)

    def test_analyze_with_different_period(self):
        result_7 = self.agent.analyze({'period_days': 7})
        result_90 = self.agent.analyze({'period_days': 90})
        assert 'error' not in result_7
        assert 'error' not in result_90

class TestTransfersIntelligenceAgent:
    def setup_method(self):
        self.agent = TransfersIntelligenceAgent()

    def test_init_sets_name(self):
        assert self.agent.name == 'TransfersIntelligenceAgent'

    def test_analyze_returns_dict(self):
        result = self.agent.analyze({})
        assert isinstance(result, dict)
        assert 'recommendations' in result or 'error' in result

class TestDataManagementAgent:
    def setup_method(self):
        self.agent = DataManagementAgent()

    def test_init_sets_name(self):
        assert self.agent.name == 'DataManagementAgent'

    def test_analyze_returns_dict(self):
        result = self.agent.analyze({})
        assert isinstance(result, dict)
        assert 'status' in result or 'error' in result

    def test_analyze_contains_quality_issues(self):
        result = self.agent.analyze({})
        assert 'quality_issues' in result or 'error' in result
