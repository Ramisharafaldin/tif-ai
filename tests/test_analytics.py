import pytest
from app.services.skills import (
    calculate_safety_stock, calculate_eoq,
    analyze_abc, analyze_xyz, analyze_fsn,
)


class TestSafetyStock:
    def test_returns_required_keys(self):
        result = calculate_safety_stock({})
        assert 'items' in result
        assert 'summary' in result

    def test_summary_has_required_fields(self):
        result = calculate_safety_stock({})
        s = result['summary']
        assert 'total_products' in s
        assert 'total_safety_stock' in s
        assert 'service_level_pct' in s
        assert 'lead_time_days' in s

    def test_items_have_required_fields(self):
        result = calculate_safety_stock({})
        if result['items']:
            item = result['items'][0]
            assert 'product_code' in item
            assert 'safety_stock' in item
            assert 'reorder_point' in item
            assert 'current_stock' in item
            assert 'lead_time_days' in item

    def test_service_level_99(self):
        result = calculate_safety_stock({}, service_level=2.326, lead_time_days=14)
        assert result['summary']['service_level_pct'] >= 99
        assert result['summary']['lead_time_days'] == 14

    def test_items_sorted_by_deficit(self):
        result = calculate_safety_stock({})
        deficits = [i['stock_deficit'] for i in result['items']]
        assert deficits == sorted(deficits, reverse=True)


class TestEOQ:
    def test_returns_required_keys(self):
        result = calculate_eoq({})
        assert 'items' in result
        assert 'summary' in result

    def test_summary_has_required_fields(self):
        result = calculate_eoq({})
        s = result['summary']
        assert 'total_products' in s
        assert 'default_order_cost' in s
        assert 'default_holding_cost_pct' in s

    def test_items_have_required_fields(self):
        result = calculate_eoq({})
        if result['items']:
            item = result['items'][0]
            assert 'product_code' in item
            assert 'eoq' in item
            assert 'annual_demand' in item
            assert 'orders_per_year' in item

    def test_eoq_positive(self):
        result = calculate_eoq({})
        for item in result['items']:
            assert item['eoq'] > 0

    def test_custom_params(self):
        result = calculate_eoq({}, order_cost=100.0, holding_cost_pct=0.30)
        assert result['summary']['default_order_cost'] == 100.0
        assert result['summary']['default_holding_cost_pct'] == 0.30


class TestABC:
    def test_returns_required_keys(self):
        result = analyze_abc({})
        assert 'categories' in result
        assert 'summary' in result

    def test_three_categories(self):
        result = analyze_abc({})
        assert 'A' in result['categories']
        assert 'B' in result['categories']
        assert 'C' in result['categories']

    def test_category_has_items_count_value_pct(self):
        result = analyze_abc({})
        for cat in ['A', 'B', 'C']:
            c = result['categories'][cat]
            assert 'items' in c
            assert 'count' in c
            assert 'value' in c
            assert 'pct' in c

    def test_percentages_sum_to_100(self):
        result = analyze_abc({})
        total_pct = sum(result['categories'][c]['pct'] for c in ['A', 'B', 'C'])
        if result['summary']['total_value'] > 0:
            assert abs(total_pct - 100) < 1

    def test_summary(self):
        result = analyze_abc({})
        s = result['summary']
        assert 'total_value' in s
        assert 'a_value' in s
        assert 'b_value' in s
        assert 'c_value' in s

    def test_a_value_gt_b_value_gt_c_value(self):
        result = analyze_abc({})
        if result['summary']['total_value'] > 0:
            assert result['summary']['a_value'] >= result['summary']['b_value']
            assert result['summary']['b_value'] >= result['summary']['c_value']


class TestXYZ:
    def test_returns_required_keys(self):
        result = analyze_xyz({})
        assert 'categories' in result
        assert 'summary' in result

    def test_three_categories(self):
        result = analyze_xyz({})
        assert 'X' in result['categories']
        assert 'Y' in result['categories']
        assert 'Z' in result['categories']

    def test_category_has_items_count(self):
        result = analyze_xyz({})
        for cat in ['X', 'Y', 'Z']:
            c = result['categories'][cat]
            assert 'items' in c
            assert 'count' in c

    def test_items_have_cv(self):
        result = analyze_xyz({})
        for cat in ['X', 'Y', 'Z']:
            for item in result['categories'][cat]['items']:
                assert 'cv' in item
                assert 'xyz_class' in item


class TestFSN:
    def test_returns_required_keys(self):
        result = analyze_fsn({})
        assert 'categories' in result
        assert 'summary' in result

    def test_three_categories(self):
        result = analyze_fsn({})
        assert 'F' in result['categories']
        assert 'S' in result['categories']
        assert 'N' in result['categories']

    def test_category_has_label(self):
        result = analyze_fsn({})
        assert result['categories']['F']['label'] == 'Fast Moving'
        assert result['categories']['S']['label'] == 'Slow Moving'
        assert result['categories']['N']['label'] == 'Non-Moving'

    def test_items_have_fsn_class(self):
        result = analyze_fsn({})
        for cat in ['F', 'S', 'N']:
            for item in result['categories'][cat]['items']:
                assert 'fsn_class' in item
                assert 'daily_sales_rate' in item
