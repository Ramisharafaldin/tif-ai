import pandas as pd
import numpy as np
from typing import Dict, Any, List

def calculate_kpis(data_slice: Dict[str, Any], kpi_list: List[str]) -> Dict[str, Any]:
    '''
    Simple implementation: compute basic KPIs from loaded data.
    For demonstration, we compute total sales, total inventory value, inventory turns.
    '''
    # Load data
    from app.data.db import load_inventory_data, load_sales_data
    inv_df = load_inventory_data()
    sales_df = load_sales_data()
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
            'format': 'currency',
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