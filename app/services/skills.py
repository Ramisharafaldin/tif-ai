import pandas as pd
import numpy as np
from typing import Dict, Any, List

def calculate_kpis(data_slice: Dict[str, Any], kpi_list: List[str], start_date: str = None, end_date: str = None) -> Dict[str, Any]:
    from app.data.db import load_inventory_data, load_sales_data
    inv_df = load_inventory_data(start_date, end_date)
    sales_df = load_sales_data(start_date, end_date)
    result = {'kpis': []}
    if inv_df.empty and sales_df.empty:
        return result
    # Example KPI: total sales quantity
    if 'total_sales_qty' in kpi_list:
        total_qty = int(sales_df['quantity_sold'].sum()) if not sales_df.empty else 0
        result['kpis'].append({
            'name': 'total_sales_qty',
            'value': float(total_qty),
            'format': 'number',
            'trend': 'stable',
            'explanation': 'Total quantity sold across all branches.'
        })
    # Example KPI: total inventory value (cost)
    if 'total_inventory_value' in kpi_list:
        if not inv_df.empty:
            inv_df['inventory_value'] = inv_df['unit_cost'] * inv_df['closing_stock']
            total_val = float(inv_df['inventory_value'].sum())
        else:
            total_val = 0.0
        result['kpis'].append({
            'name': 'total_inventory_value',
            'value': total_val,
            'format': 'number',
            'trend': 'stable',
            'explanation': 'Total inventory value at cost.'
        })
    # Example KPI: inventory turns (sales / avg inventory)
    if 'inventory_turns' in kpi_list:
        if not inv_df.empty and not sales_df.empty:
            # Approximate COGS using average unit cost from inventory
            avg_cost = float(inv_df['unit_cost'].mean()) if not inv_df.empty else 0.0
            # Assuming sales have unit_price, we approximate cost of goods sold using avg_cost
            cogs = float((sales_df['quantity_sold'] * avg_cost).sum())
            avg_inventory_value = float(((inv_df['unit_cost'] * inv_df['closing_stock']).sum()) / max(len(inv_df), 1))
            turns = cogs / avg_inventory_value if avg_inventory_value != 0 else 0.0
        else:
            turns = 0.0
        result['kpis'].append({
            'name': 'inventory_turns',
            'value': float(turns),
            'format': 'number',
            'trend': 'stable',
            'explanation': 'Ratio of cost of goods sold to average inventory value.'
        })
    return result

def detect_anomalies(metric_series: List[Dict[str, Any]], method: str = 'zscore', threshold: float = 3.0) -> Dict[str, Any]:
    '''
    Very simple anomaly detection using z-score on a numeric series.
    Expects metric_series list of dicts with 'date' and 'value'.
    '''
    if not metric_series:
        return {'anomalies': []}
    values = [float(item.get('value', 0)) for item in metric_series]
    if len(values) < 2:
        return {'anomalies': []}
    mean = np.mean(values)
    std = np.std(values)
    if std == 0:
        return {'anomalies': []}
    anomalies = []
    for i, (pt, val) in enumerate(zip(metric_series, values)):
        z = abs((val - mean) / std)
        if z > threshold:
            anomalies.append({
                'date': pt.get('date'),
                'value': val,
                'score': float(z),
                'explanation': f'Z-score {z:.2f} exceeds threshold {threshold}'
            })
    return {'anomalies': anomalies}

def generate_executive_summary(kpis: List[Dict[str, Any]], alerts: List[Dict[str, Any]], insights: List[Dict[str, Any]]) -> Dict[str, Any]:
    '''
    Concatenate a simple textual summary.
    '''
    summary_parts = []
    if kpis:
        summary_parts.append(f'Key metrics show {len(kpis)} indicators.')
    if alerts:
        summary_parts.append(f'{len(alerts)} alerts require attention.')
    if insights:
        summary_parts.append(f'{len(insights)} insights identified.')
    if not summary_parts:
        summary = 'No significant data available.'
    else:
        summary = ' '.join(summary_parts)
    return {'summary': summary, 'tone': 'neutral'}

def analyze_inventory(data_slice: Dict[str, Any], mode: str = 'value', start_date: str = None, end_date: str = None, target_days: int = 30) -> Dict[str, Any]:
    from app.data.db import load_inventory_data, load_sales_data
    inv_df = load_inventory_data(start_date, end_date)
    sales_df = load_sales_data(start_date, end_date)
    result = {'summary': {'total_products': 0, 'total_stock_value': 0, 'total_items': 0, 'overstocked_count': 0, 'low_stock_count': 0, 'out_of_stock_count': 0}, 'items': [], 'alerts': []}

    if inv_df.empty:
        result['mode'] = mode
        result['target_days'] = target_days
        return result

    inv_df['stock_value'] = inv_df['unit_cost'] * inv_df['closing_stock']
    total_value = float(inv_df['stock_value'].sum())
    total_items = int(inv_df['closing_stock'].sum())
    total_products = int(inv_df['product_code'].nunique())

    status_list = []
    alerts = []
    overstocked = 0
    low_stock = 0
    out_of_stock = 0
    sales_product_map = {}
    date_range_days = 30
    if not sales_df.empty:
        sales_product_map = sales_df.groupby('product_code')['quantity_sold'].sum().to_dict()
        try:
            dates = pd.to_datetime(sales_df['date'])
            date_range_days = max((dates.max() - dates.min()).days, 1)
        except Exception:
            date_range_days = 30

    for _, row in inv_df.iterrows():
        total_sales = sales_product_map.get(row['product_code'], 0)
        avg_daily_sales = total_sales / max(date_range_days, 1)
        months_of_stock = row['closing_stock'] / max(avg_daily_sales, 0.01) / 30
        target_stock = avg_daily_sales * target_days
        required_purchase = max(0, int(target_stock - row['closing_stock']))

        if row['closing_stock'] == 0:
            status = 'out_of_stock'
            out_of_stock += 1
        elif months_of_stock > 6:
            status = 'overstocked'
            overstocked += 1
        elif months_of_stock < 1:
            status = 'low'
            low_stock += 1
        else:
            status = 'normal'

        item = {
            'product_code': row['product_code'],
            'product_name': row['product_name'],
            'category': row['category'],
            'branch_code': row['branch_code'],
            'branch_name': row['branch_name'],
            'closing_stock': int(row['closing_stock']),
            'unit_cost': float(row['unit_cost']),
            'stock_value': float(row['stock_value']),
            'status': status,
            'avg_daily_sales': round(avg_daily_sales, 2),
            'months_of_stock': round(months_of_stock, 1),
            'target_stock': round(target_stock, 1),
            'required_purchase_qty': required_purchase,
        }
        if mode == 'quantity':
            item['display_value'] = int(row['closing_stock'])
            item['display_unit'] = 'units'
        else:
            item['display_value'] = float(row['stock_value'])
            item['display_unit'] = 'value'
        status_list.append(item)

    if overstocked > 0:
        alerts.append({
            'type': 'overstock',
            'severity': 'medium',
            'entity': 'inventory',
            'message': f'{overstocked} product(s) are overstocked (>6 months supply).',
            'recommended_action': 'Consider discount promotions or transfer to other branches.'
        })
    if low_stock > 0:
        alerts.append({
            'type': 'low_stock',
            'severity': 'high' if low_stock > 5 else 'medium',
            'entity': 'inventory',
            'message': f'{low_stock} product(s) have low stock levels (<1 month supply).',
            'recommended_action': 'Place purchase orders to replenish stock.'
        })
    if out_of_stock > 0:
        alerts.append({
            'type': 'out_of_stock',
            'severity': 'high',
            'entity': 'inventory',
            'message': f'{out_of_stock} product(s) are out of stock.',
            'recommended_action': 'Urgent replenishment required.'
        })

    result['summary'] = {
        'total_products': total_products,
        'total_stock_value': total_value,
        'total_items': total_items,
        'overstocked_count': overstocked,
        'low_stock_count': low_stock,
        'out_of_stock_count': out_of_stock,
    }
    result['items'] = status_list
    result['alerts'] = alerts
    result['mode'] = mode
    result['target_days'] = target_days
    return result

def run_forecast(data_slice: Dict[str, Any], period_days: int = 30, mode: str = 'quantity', start_date: str = None, end_date: str = None) -> Dict[str, Any]:
    from app.data.db import load_sales_data, load_inventory_data
    sales_df = load_sales_data(start_date, end_date)
    inv_df = load_inventory_data(start_date, end_date)

    if sales_df.empty:
        return {'period': {'start_date': '', 'end_date': '', 'total_forecast_qty': 0, 'total_forecast_value': 0}, 'items': [], 'mode': mode}

    sales_df['date'] = pd.to_datetime(sales_df['date'])
    date_range_days = max((sales_df['date'].max() - sales_df['date'].min()).days, 1)

    product_price_map = {}
    if not inv_df.empty:
        product_price_map = dict(zip(inv_df['product_code'], inv_df['unit_price']))
    product_name_map = {**product_price_map}
    if not inv_df.empty:
        product_name_map = dict(zip(inv_df['product_code'], inv_df['product_name']))

    products = []
    for code, grp in sales_df.groupby('product_code'):
        daily = grp.groupby(grp['date'].dt.date)['quantity_sold'].sum().reset_index()
        daily.columns = ['date', 'qty']
        daily = daily.sort_values('date')
        avg_qty = daily['qty'].mean()
        days_n = max(len(daily), 2)

        # Simple linear regression for trend
        x = np.arange(len(daily))
        y = daily['qty'].values
        slope = 0
        try:
            slope, _ = np.polyfit(x, y, 1)
        except Exception:
            pass

        trend = 'up' if slope > 0.5 else ('down' if slope < -0.5 else 'stable')
        forecast = max(0, (avg_qty + slope * (days_n / 2)) * period_days / 30)
        r2 = 0.5
        if days_n > 2:
            try:
                y_pred = np.polyval([slope, np.mean(y) - slope * np.mean(x)], x)
                ss_res = np.sum((y - y_pred) ** 2)
                ss_tot = np.sum((y - np.mean(y)) ** 2)
                r2 = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0.5
            except Exception:
                pass

        product_name = product_name_map.get(code, code)
        unit_price = product_price_map.get(code, 0)
        forecast_value = round(forecast * unit_price, 2) if mode == 'value' else 0
        products.append({
            'product_code': code,
            'product_name': product_name,
            'branch_code': 'all',
            'historical_avg_sales': round(avg_qty, 2),
            'forecast_qty': round(forecast, 1),
            'forecast_value': forecast_value,
            'confidence': round(min(0.95, max(0.3, r2)), 2),
            'trend': trend,
        })

    total_forecast = sum(p['forecast_qty'] for p in products)
    total_forecast_value = sum(p.get('forecast_value', 0) for p in products)
    avg_price = sales_df['unit_price'].mean() if not sales_df.empty else 0
    if mode == 'value' and total_forecast_value == 0:
        total_forecast_value = round(total_forecast * avg_price, 2)
    result = {
        'period': {
            'start_date': pd.Timestamp.now().strftime('%Y-%m-%d'),
            'end_date': (pd.Timestamp.now() + pd.Timedelta(days=period_days)).strftime('%Y-%m-%d'),
            'total_forecast_qty': round(total_forecast, 1),
            'total_forecast_value': total_forecast_value,
        },
        'items': products,
        'mode': mode,
    }
    return result

def analyze_transfers(data_slice: Dict[str, Any], mode: str = 'value', start_date: str = None, end_date: str = None) -> Dict[str, Any]:
    from app.data.db import load_inventory_data, load_sales_data
    inv_df = load_inventory_data(start_date, end_date)
    sales_df = load_sales_data(start_date, end_date)

    if inv_df.empty:
        return {'recommendations': [], 'alerts': [], 'mode': mode}

    branches = inv_df['branch_code'].unique()
    recommendations = []
    alerts = []

    inv_df['stock_value'] = inv_df['unit_cost'] * inv_df['closing_stock']

    sales_product_map = {}
    if not sales_df.empty:
        sales_product_map = sales_df.groupby('product_code')['quantity_sold'].sum().to_dict()

    products = inv_df['product_code'].unique()
    for prod in products:
        prod_data = inv_df[inv_df['product_code'] == prod]
        prod_name = prod_data['product_name'].iloc[0]
        avg_sales = sales_product_map.get(prod, 0) or 1

        for _, row in prod_data.iterrows():
            months_of_stock = row['closing_stock'] / max(avg_sales / 30, 0.01)
            stock_metric = row['stock_value'] if mode == 'value' else row['closing_stock']
            transfer_threshold = 4
            min_stock_for_transfer = 10
            if mode == 'value':
                min_stock_for_transfer = row['unit_cost'] * 10

            if months_of_stock > transfer_threshold:
                for _, other_row in prod_data.iterrows():
                    if other_row['branch_code'] == row['branch_code']:
                        continue
                    other_months = other_row['closing_stock'] / max(avg_sales / 30, 0.01)
                    other_metric = other_row['stock_value'] if mode == 'value' else other_row['closing_stock']
                    if other_months < 1 and stock_metric > min_stock_for_transfer:
                        transfer_qty = min(row['closing_stock'] // 2, max(10, int(avg_sales * 15)))
                        recommendations.append({
                            'product_code': prod,
                            'product_name': prod_name,
                            'from_branch': row['branch_code'],
                            'to_branch': other_row['branch_code'],
                            'quantity': transfer_qty,
                            'reason': f'Branch {row["branch_code"]} has {months_of_stock:.1f} months of stock; Branch {other_row["branch_code"]} has only {other_months:.1f} months.',
                            'priority': 'high' if other_months < 0.5 else 'medium',
                        })
                        break

    if not recommendations:
        alerts.append({
            'type': 'no_transfers_needed',
            'severity': 'low',
            'entity': 'transfers',
            'message': 'Stock levels are balanced across all branches.',
            'recommended_action': 'No transfers required at this time.'
        })

    return {'recommendations': recommendations[:20], 'alerts': alerts, 'mode': mode}

def calculate_safety_stock(data_slice: Dict[str, Any], service_level: float = 1.645, lead_time_days: int = 7) -> Dict[str, Any]:
    """
    Calculate safety stock for each product: Z × σ × √LT
    - Z = service level factor (1.645 = 95%, 2.326 = 99%)
    - σ = standard deviation of daily sales
    - LT = lead time in days
    """
    from app.data.db import load_sales_data, load_inventory_data
    sales_df = load_sales_data()
    inv_df = load_inventory_data()

    if sales_df.empty or inv_df.empty:
        return {'items': [], 'summary': {'total_products': 0, 'total_safety_stock': 0}}

    sales_df['date'] = pd.to_datetime(sales_df['date'])
    items = []
    for code, grp in sales_df.groupby('product_code'):
        daily = grp.groupby(grp['date'].dt.date)['quantity_sold'].sum()
        if len(daily) < 2:
            continue
        std = daily.std()
        avg = daily.mean()
        safety = round(std * service_level * (lead_time_days ** 0.5), 1)
        rop = round(avg * lead_time_days + safety, 1)

        prod_inv = inv_df[inv_df['product_code'] == code]
        name = prod_inv['product_name'].iloc[0] if not prod_inv.empty else code
        current = int(prod_inv['closing_stock'].sum()) if not prod_inv.empty else 0

        items.append({
            'product_code': code,
            'product_name': name,
            'avg_daily_sales': round(avg, 2),
            'sales_std': round(std, 2),
            'service_level_z': service_level,
            'lead_time_days': lead_time_days,
            'safety_stock': safety,
            'reorder_point': rop,
            'current_stock': current,
            'stock_deficit': max(0, round(rop - current)),
        })

    items.sort(key=lambda x: x['stock_deficit'], reverse=True)
    return {
        'items': items,
        'summary': {
            'total_products': len(items),
            'total_safety_stock': round(sum(i['safety_stock'] for i in items), 1),
            'service_level_pct': round((service_level / 2.326) * 99 + 1, 0),
            'lead_time_days': lead_time_days,
        },
    }


def calculate_eoq(data_slice: Dict[str, Any], order_cost: float = 50.0, holding_cost_pct: float = 0.25) -> Dict[str, Any]:
    """
    Calculate Economic Order Quantity: √(2DS/H)
    - D = annual demand
    - S = ordering cost per order
    - H = holding cost per unit per year (unit_cost × holding_cost_pct)
    """
    from app.data.db import load_sales_data, load_inventory_data
    sales_df = load_sales_data()
    inv_df = load_inventory_data()

    if sales_df.empty or inv_df.empty:
        return {'items': [], 'summary': {'total_products': 0}}

    items = []
    for code, grp in sales_df.groupby('product_code'):
        annual_demand = grp['quantity_sold'].sum() * 12  # annualize
        prod_inv = inv_df[inv_df['product_code'] == code]
        if prod_inv.empty:
            continue
        unit_cost = prod_inv['unit_cost'].iloc[0]
        name = prod_inv['product_name'].iloc[0]
        holding_cost = unit_cost * holding_cost_pct
        if holding_cost <= 0:
            continue
        eoq = round((2 * annual_demand * order_cost / holding_cost) ** 0.5, 0)
        current = int(prod_inv['closing_stock'].sum())
        items.append({
            'product_code': code,
            'product_name': name,
            'unit_cost': float(unit_cost),
            'annual_demand': int(annual_demand),
            'order_cost': order_cost,
            'holding_cost_per_unit': round(holding_cost, 2),
            'holding_cost_pct': holding_cost_pct,
            'eoq': int(eoq),
            'current_stock': current,
            'orders_per_year': round(annual_demand / max(eoq, 1), 1),
        })

    items.sort(key=lambda x: x['eoq'], reverse=True)
    return {
        'items': items,
        'summary': {
            'total_products': len(items),
            'default_order_cost': order_cost,
            'default_holding_cost_pct': holding_cost_pct,
        },
    }


def analyze_abc(data_slice: Dict[str, Any]) -> Dict[str, Any]:
    """
    ABC analysis by inventory value (A=70%, B=20%, C=10%).
    """
    from app.data.db import load_inventory_data
    df = load_inventory_data()
    if df.empty:
        return {'categories': {'A': [], 'B': [], 'C': []}, 'summary': {'total_value': 0, 'a_value': 0, 'b_value': 0, 'c_value': 0}}

    df['stock_value'] = df['closing_stock'] * df['unit_cost']
    prod_value = df.groupby('product_code').agg({
        'product_name': 'first', 'stock_value': 'sum', 'closing_stock': 'sum', 'category': 'first',
    }).reset_index()
    prod_value = prod_value.sort_values('stock_value', ascending=False)
    total = prod_value['stock_value'].sum()
    cumulative = 0

    categories = {'A': [], 'B': [], 'C': []}
    a_val = b_val = c_val = 0

    for _, row in prod_value.iterrows():
        cumulative += row['stock_value']
        pct = cumulative / total
        item = {
            'product_code': row['product_code'],
            'product_name': row['product_name'],
            'stock_value': float(row['stock_value']),
            'closing_stock': int(row['closing_stock']),
            'category': row['category'],
            'cumulative_pct': round(pct * 100, 1),
        }
        if pct <= 0.70:
            item['abc_class'] = 'A'
            categories['A'].append(item)
            a_val += row['stock_value']
        elif pct <= 0.90:
            item['abc_class'] = 'B'
            categories['B'].append(item)
            b_val += row['stock_value']
        else:
            item['abc_class'] = 'C'
            categories['C'].append(item)
            c_val += row['stock_value']

    return {
        'categories': {
            'A': {'items': categories['A'], 'count': len(categories['A']), 'value': round(a_val, 2), 'pct': round(a_val / total * 100, 1) if total else 0},
            'B': {'items': categories['B'], 'count': len(categories['B']), 'value': round(b_val, 2), 'pct': round(b_val / total * 100, 1) if total else 0},
            'C': {'items': categories['C'], 'count': len(categories['C']), 'value': round(c_val, 2), 'pct': round(c_val / total * 100, 1) if total else 0},
        },
        'summary': {'total_value': round(total, 2), 'a_value': round(a_val, 2), 'b_value': round(b_val, 2), 'c_value': round(c_val, 2)},
    }


def analyze_xyz(data_slice: Dict[str, Any]) -> Dict[str, Any]:
    """
    XYZ analysis by demand variability (CV = σ/μ).
    X: CV < 0.5 (stable), Y: 0.5 <= CV < 1.0 (variable), Z: CV >= 1.0 (erratic)
    """
    from app.data.db import load_sales_data, load_inventory_data
    sales_df = load_sales_data()
    inv_df = load_inventory_data()

    if sales_df.empty:
        return {'categories': {'X': [], 'Y': [], 'Z': []}, 'summary': {'total_products': 0}}

    sales_df['date'] = pd.to_datetime(sales_df['date'])
    categories = {'X': [], 'Y': [], 'Z': []}

    for code, grp in sales_df.groupby('product_code'):
        daily = grp.groupby(grp['date'].dt.date)['quantity_sold'].sum()
        if len(daily) < 2:
            continue
        mean = daily.mean()
        std = daily.std()
        cv = std / mean if mean > 0 else 999

        prod_inv = inv_df[inv_df['product_code'] == code]
        name = prod_inv['product_name'].iloc[0] if not prod_inv.empty else code

        item = {
            'product_code': code,
            'product_name': name,
            'avg_daily_sales': round(mean, 2),
            'std_daily_sales': round(std, 2),
            'cv': round(cv, 2),
        }

        if cv < 0.5:
            item['xyz_class'] = 'X'
            categories['X'].append(item)
        elif cv < 1.0:
            item['xyz_class'] = 'Y'
            categories['Y'].append(item)
        else:
            item['xyz_class'] = 'Z'
            categories['Z'].append(item)

    return {
        'categories': {
            'X': {'items': categories['X'], 'count': len(categories['X'])},
            'Y': {'items': categories['Y'], 'count': len(categories['Y'])},
            'Z': {'items': categories['Z'], 'count': len(categories['Z'])},
        },
        'summary': {'total_products': len(categories['X']) + len(categories['Y']) + len(categories['Z'])},
    }


def analyze_fsn(data_slice: Dict[str, Any]) -> Dict[str, Any]:
    """
    FSN analysis by movement speed (Fast/Slow/Non-moving).
    Based on average daily sales rate.
    """
    from app.data.db import load_sales_data, load_inventory_data
    sales_df = load_sales_data()
    inv_df = load_inventory_data()

    if sales_df.empty or inv_df.empty:
        return {'categories': {'F': [], 'S': [], 'N': []}, 'summary': {'total_products': 0}}

    sales_df['date'] = pd.to_datetime(sales_df['date'])
    date_range = max((sales_df['date'].max() - sales_df['date'].min()).days, 1)

    product_sales = sales_df.groupby('product_code')['quantity_sold'].sum().to_dict()
    product_days = sales_df.groupby('product_code')['date'].nunique().to_dict()

    items_f, items_s, items_n = [], [], []

    for code, total_sales in product_sales.items():
        active_days = product_days.get(code, 1)
        daily_rate = total_sales / max(active_days, 1)
        name = inv_df[inv_df['product_code'] == code]['product_name'].iloc[0] if code in inv_df['product_code'].values else code

        item = {
            'product_code': code,
            'product_name': name,
            'total_sales': int(total_sales),
            'active_days': active_days,
            'daily_sales_rate': round(daily_rate, 2),
        }

        if daily_rate >= 5:
            item['fsn_class'] = 'F'
            items_f.append(item)
        elif daily_rate >= 1:
            item['fsn_class'] = 'S'
            items_s.append(item)
        else:
            item['fsn_class'] = 'N'
            items_n.append(item)

    return {
        'categories': {
            'F': {'items': items_f, 'count': len(items_f), 'label': 'Fast Moving'},
            'S': {'items': items_s, 'count': len(items_s), 'label': 'Slow Moving'},
            'N': {'items': items_n, 'count': len(items_n), 'label': 'Non-Moving'},
        },
        'summary': {'total_products': len(items_f) + len(items_s) + len(items_n)},
    }


def check_data_quality(data_slice: Dict[str, Any]) -> Dict[str, Any]:
    from app.data.db import load_inventory_data, load_sales_data
    inv_df = load_inventory_data()
    sales_df = load_sales_data()
    issues = []

    if not inv_df.empty:
        null_inv = inv_df.isnull().sum()
        for col in null_inv[null_inv > 0].index:
            issues.append({
                'table': 'inventory_data',
                'column': col,
                'issue': f'{int(null_inv[col])} null values',
                'severity': 'medium',
                'row_count': int(null_inv[col]),
            })

        neg_stock = inv_df[inv_df['closing_stock'] < 0]
        if not neg_stock.empty:
            issues.append({
                'table': 'inventory_data',
                'column': 'closing_stock',
                'issue': f'{len(neg_stock)} rows with negative stock',
                'severity': 'high',
                'row_count': len(neg_stock),
            })

    if not sales_df.empty:
        null_sales = sales_df.isnull().sum()
        for col in null_sales[null_sales > 0].index:
            issues.append({
                'table': 'sales_data',
                'column': col,
                'issue': f'{int(null_sales[col])} null values',
                'severity': 'medium',
                'row_count': int(null_sales[col]),
            })

    status = {
        'inventory_rows': len(inv_df),
        'sales_rows': len(sales_df),
        'inventory_columns': len(inv_df.columns) if not inv_df.empty else 0,
        'sales_columns': len(sales_df.columns) if not sales_df.empty else 0,
        'has_inventory_data': not inv_df.empty,
        'has_sales_data': not sales_df.empty,
        'last_upload': None,
    }
    return {'status': status, 'quality_issues': issues}