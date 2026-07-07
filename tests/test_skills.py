import pytest
from app.services.skills import calculate_kpis, detect_anomalies, generate_executive_summary, analyze_inventory, run_forecast, analyze_transfers, check_data_quality

class TestCalculateKPIs:
    def test_returns_dict_with_kpis_key(self):
        result = calculate_kpis({}, ['total_sales_qty'])
        assert isinstance(result, dict)
        assert 'kpis' in result

    def test_returns_empty_kpis_for_no_data_slice(self):
        result = calculate_kpis({}, [])
        assert result['kpis'] == []

    def test_kpi_has_required_fields(self):
        result = calculate_kpis({}, ['total_sales_qty'])
        if result['kpis']:
            kpi = result['kpis'][0]
            assert 'name' in kpi
            assert 'value' in kpi
            assert 'format' in kpi
            assert 'trend' in kpi

class TestDetectAnomalies:
    def test_returns_dict_with_anomalies_key(self):
        result = detect_anomalies([], 'zscore', 3.0)
        assert isinstance(result, dict)
        assert 'anomalies' in result

    def test_returns_empty_for_empty_series(self):
        result = detect_anomalies([], 'zscore', 3.0)
        assert result['anomalies'] == []

    def test_no_anomalies_for_constant_values(self):
        series = [{'date': '2025-01-01', 'value': 10}] * 5
        result = detect_anomalies(series, 'zscore', 3.0)
        assert result['anomalies'] == []

    def test_detects_obvious_anomaly(self):
        series = [{'date': f'2025-01-{i:02d}', 'value': 10} for i in range(1, 11)]
        series.append({'date': '2025-01-11', 'value': 1000})
        result = detect_anomalies(series, 'zscore', 2.5)
        assert len(result['anomalies']) > 0
        assert result['anomalies'][0]['date'] == '2025-01-11'

class TestGenerateExecutiveSummary:
    def test_returns_summary_key(self):
        result = generate_executive_summary([], [], [])
        assert 'summary' in result
        assert 'tone' in result

    def test_no_data_message(self):
        result = generate_executive_summary([], [], [])
        assert 'No significant data' in result['summary']

    def test_includes_kpis_count(self):
        result = generate_executive_summary([{'name': 'test', 'value': 1}], [], [])
        assert '1 indicators' in result['summary']

    def test_includes_alerts_count(self):
        result = generate_executive_summary([], [{'type': 'test'}], [])
        assert '1 alerts' in result['summary']

class TestAnalyzeInventory:
    def test_returns_required_keys(self):
        result = analyze_inventory({})
        assert 'summary' in result
        assert 'items' in result
        assert 'alerts' in result

    def test_summary_has_required_fields(self):
        result = analyze_inventory({})
        summary = result['summary']
        assert 'total_products' in summary
        assert 'total_stock_value' in summary
        assert 'total_items' in summary

class TestRunForecast:
    def test_returns_required_keys(self):
        result = run_forecast({}, 30)
        assert 'period' in result
        assert 'items' in result

    def test_period_has_required_fields(self):
        result = run_forecast({}, 30)
        period = result['period']
        assert 'start_date' in period
        assert 'end_date' in period
        assert 'total_forecast_qty' in period

class TestAnalyzeTransfers:
    def test_returns_required_keys(self):
        result = analyze_transfers({})
        assert 'recommendations' in result
        assert 'alerts' in result

class TestCheckDataQuality:
    def test_returns_required_keys(self):
        result = check_data_quality({})
        assert 'status' in result
        assert 'quality_issues' in result

    def test_status_has_required_fields(self):
        result = check_data_quality({})
        status = result['status']
        assert 'inventory_rows' in status
        assert 'sales_rows' in status
        assert 'has_inventory_data' in status
        assert 'has_sales_data' in status
