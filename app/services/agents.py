import time
import pandas as pd
from typing import Optional
from app.core.config import logger
from .skills import calculate_kpis, detect_anomalies, generate_executive_summary, analyze_inventory, run_forecast, analyze_transfers, check_data_quality, calculate_safety_stock, calculate_eoq, analyze_abc, analyze_xyz, analyze_fsn
from app.data.db import log_agent_invocation, load_sales_data, load_inventory_data
from .i18n import t
from .narrative_generator import generate_narrative, format_kpis_for_prompt, format_alerts_for_prompt, format_insights_for_prompt
from .prompts_templates import get_template

def _translate_output(output: dict, lang: Optional[str]) -> dict:
    if lang != 'ar':
        return output
    out = {}
    for k, v in output.items():
        if k == 'kpis' and isinstance(v, list):
            out[k] = []
            for kpi in v:
                kpi = dict(kpi)
                if 'name' in kpi:
                    kpi['name'] = t(kpi['name'], lang)
                if 'explanation' in kpi:
                    kpi['explanation'] = t(kpi['explanation'], lang)
                if 'trend' in kpi:
                    kpi['trend'] = t(kpi['trend'], lang)
                out[k].append(kpi)
        elif k == 'alerts' and isinstance(v, list):
            out[k] = []
            for alert in v:
                alert = dict(alert)
                if 'type' in alert:
                    alert['type'] = t(alert['type'], lang)
                if 'severity' in alert:
                    alert['severity'] = t(alert['severity'], lang)
                if 'message' in alert:
                    alert['message'] = t(alert['message'], lang)
                if 'recommended_action' in alert:
                    alert['recommended_action'] = t(alert['recommended_action'], lang)
                out[k].append(alert)
        elif k == 'insights' and isinstance(v, list):
            out[k] = []
            for ins in v:
                ins = dict(ins)
                if 'title' in ins:
                    ins['title'] = t(ins['title'], lang)
                if 'description' in ins:
                    ins['description'] = t(ins['description'], lang)
                if 'recommended_action' in ins:
                    ins['recommended_action'] = t(ins['recommended_action'], lang)
                out[k].append(ins)
        elif k == 'items' and isinstance(v, list) and any('status' in i for i in v):
            out[k] = []
            for item in v:
                item = dict(item)
                out[k].append(item)
        elif k == 'recommendations' and isinstance(v, list):
            out[k] = []
            for rec in v:
                rec = dict(rec)
                if 'reason' in rec:
                    rec['reason'] = t(rec['reason'], lang)
                if 'priority' in rec:
                    rec['priority'] = t(rec['priority'], lang)
                out[k].append(rec)
        elif k == 'summary' and isinstance(v, dict):
            out[k] = dict(v)
        elif k == 'period' and isinstance(v, dict):
            out[k] = dict(v)
        elif k == 'issues' and isinstance(v, list):
            out[k] = []
            for issue in v:
                issue = dict(issue)
                if 'issue' in issue:
                    issue['issue'] = t(issue['issue'], lang)
                if 'severity' in issue:
                    issue['severity'] = t(issue['severity'], lang)
                if 'table' in issue:
                    issue['table'] = t(issue['table'], lang)
                out[k].append(issue)
        else:
            out[k] = v
    return out

class DashboardIntelligenceAgent:
    def __init__(self):
        self.name = 'DashboardIntelligenceAgent'
        logger.info(f"[Agent] Initialized {self.name}")

    def analyze(self, input_dict: dict) -> dict:
        start = time.time()
        try:
            lang = input_dict.get('lang', 'en')
            start_date = input_dict.get('start_date')
            end_date = input_dict.get('end_date')
            branch_id = input_dict.get('branch_id')
            date_range = input_dict.get('date_range', {})
            category = input_dict.get('category')
            product_id = input_dict.get('product_id')
            include_kpis = input_dict.get('include_kpis', True)
            include_alerts = input_dict.get('include_alerts', True)
            include_insights = input_dict.get('include_insights', True)

            data_slice = {}
            kpis = []
            alerts = []
            insights = []

            if include_kpis:
                kpi_names = ['total_sales_qty', 'total_inventory_value', 'inventory_turns']
                kpis_resp = calculate_kpis(data_slice, kpi_names, start_date, end_date)
                kpis = kpis_resp.get('kpis', [])

            if include_alerts:
                from app.data.db import load_sales_data
                sales_df = load_sales_data(start_date, end_date)
                if not sales_df.empty:
                    # Ensure date column is datetime
                    sales_df['date'] = pd.to_datetime(sales_df['date'])
                    daily = sales_df.groupby('date')['quantity_sold'].sum().reset_index()
                    # Build list of dicts
                    series = [{'date': row['date'].strftime('%Y-%m-%d'), 'value': float(row['quantity_sold'])} for _, row in daily.iterrows()]
                    anomalies_resp = detect_anomalies(series, method='zscore', threshold=2.5)
                    anomalies = anomalies_resp.get('anomalies', [])
                    for a in anomalies:
                        alerts.append({
                            'type': 'anomaly',
                            'severity': 'high' if a['score'] > 3 else 'medium',
                            'entity': 'daily_sales_qty',
                            'message': f"Unusual sales volume on {a['date']}: {a['value']:.0f} units (Z-Score {a['score']:.2f})",
                            'recommended_action': 'Check for possible promotions or data errors.'
                        })

            if include_insights:
                # Dummy insight based on KPI values
                if kpis:
                    # find inventory turns
                    inv_turn = next((k['value'] for k in kpis if k['name'] == 'inventory_turns'), None)
                    if inv_turn is not None and inv_turn < 2:
                        insights.append({
                            'title': 'Low Inventory Turnover',
                            'description': 'Inventory turnover is below 2, indicating possible overstock.',
                            'confidence': 0.8,
                            'recommended_action': 'Review slow-moving items and consider discount promotions.'
                        })
                    else:
                        insights.append({
                            'title': 'Healthy Inventory Turnover',
                            'description': 'Inventory turnover is within a healthy range.',
                            'confidence': 0.7,
                            'recommended_action': 'Continue to monitor inventory levels.'
                        })

            # Build final output
            output = {}
            if include_kpis:
                output['kpis'] = kpis
            if include_alerts:
                output['alerts'] = alerts
            if include_insights:
                output['insights'] = insights

            # AI narrative generation
            include_narrative = input_dict.get('include_narrative', False)
            if include_narrative:
                template = get_template('dashboard', lang or 'en')
                kpis_text = format_kpis_for_prompt(kpis)
                alerts_text = format_alerts_for_prompt(alerts)
                insights_text = format_insights_for_prompt(insights)
                narrative = generate_narrative(template, {
                    'kpis': kpis_text,
                    'alert_count': str(len(alerts)),
                    'alerts': alerts_text,
                    'insights': insights_text,
                }, lang=lang or 'en')
                if narrative:
                    output['ai_narrative'] = narrative

            output['generated_at'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
            output['agent'] = self.name
            execution_time_ms = (time.time() - start) * 1000
            output['execution_time_ms'] = round(execution_time_ms, 2)

            output = _translate_output(output, lang)

            log_agent_invocation(self.name, input_dict, output, execution_time_ms, success=True)
            return output
        except Exception as e:
            execution_time_ms = (time.time() - start) * 1000
            error_output = {
                'error': str(e),
                'generated_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z',
                'agent': self.name,
                'execution_time_ms': round(execution_time_ms, 2)
            }
            log_agent_invocation(self.name, input_dict, error_output, execution_time_ms, success=False)
            return error_output

class InventoryIntelligenceAgent:
    def __init__(self):
        self.name = 'InventoryIntelligenceAgent'
        logger.info(f"[Agent] Initialized {self.name}")

    def analyze(self, input_dict: dict) -> dict:
        start = time.time()
        try:
            lang = input_dict.get('lang', 'en')
            mode = input_dict.get('mode', 'value')
            start_date = input_dict.get('start_date')
            end_date = input_dict.get('end_date')
            target_days = input_dict.get('target_days', 30)
            result = analyze_inventory(input_dict, mode=mode, start_date=start_date, end_date=end_date, target_days=target_days)
            result['generated_at'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
            result['agent'] = self.name
            items = result.get('items', [])
            if items:
                status_order = {'out_of_stock': 0, 'low': 1, 'overstocked': 2, 'normal': 3}
                items.sort(key=lambda x: status_order.get(x.get('status', 'normal'), 99))
                template = get_template('inventory_item', lang or 'en')
                ai_count = 0
                for item in items:
                    if ai_count >= 50:
                        break
                    if _should_generate_ai_recommendation(item):
                        ctx = {
                            'product_name': item.get('product_name', item.get('product_code', '')),
                            'product_code': item.get('product_code', ''),
                            'status': item.get('status', 'normal'),
                            'current_stock': str(item.get('closing_stock', 0)),
                            'avg_daily_sales': str(item.get('avg_daily_sales', 0)),
                            'months_of_stock': str(item.get('months_of_stock', 0)),
                            'required_purchase_qty': str(item.get('required_purchase_qty', 0)),
                            'target_days': str(target_days),
                        }
                        rec = generate_narrative(template, ctx, lang=lang or 'en', max_tokens=100, temperature=0.3)
                        if rec:
                            item['recommendation'] = rec.strip()
                            ai_count += 1
            result['execution_time_ms'] = round((time.time() - start) * 1000, 2)
            result = _translate_output(result, lang)
            log_agent_invocation(self.name, input_dict, result, round((time.time() - start) * 1000, 2), success=True)
            return result
        except Exception as e:
            execution_time_ms = (time.time() - start) * 1000
            error_result = {
                'error': str(e),
                'agent': self.name,
                'execution_time_ms': round(execution_time_ms, 2)
            }
            log_agent_invocation(self.name, input_dict, error_result, execution_time_ms, success=False)
            return error_result


def _should_generate_ai_recommendation(item: dict) -> bool:
    return True

class ForecastingIntelligenceAgent:
    def __init__(self):
        self.name = 'ForecastingIntelligenceAgent'
        logger.info(f"[Agent] Initialized {self.name}")

    def analyze(self, input_dict: dict) -> dict:
        start = time.time()
        try:
            lang = input_dict.get('lang', 'en')
            mode = input_dict.get('mode', 'quantity')
            period_days = input_dict.get('period_days', 30)
            start_date = input_dict.get('start_date')
            end_date = input_dict.get('end_date')
            result = run_forecast(input_dict, period_days, mode=mode, start_date=start_date, end_date=end_date)
            result['generated_at'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
            result['agent'] = self.name
            execution_time_ms = (time.time() - start) * 1000
            result['execution_time_ms'] = round(execution_time_ms, 2)
            result = _translate_output(result, lang)
            log_agent_invocation(self.name, input_dict, result, execution_time_ms, success=True)
            return result
        except Exception as e:
            execution_time_ms = (time.time() - start) * 1000
            error_result = {
                'error': str(e),
                'agent': self.name,
                'execution_time_ms': round(execution_time_ms, 2)
            }
            log_agent_invocation(self.name, input_dict, error_result, execution_time_ms, success=False)
            return error_result

class TransfersIntelligenceAgent:
    def __init__(self):
        self.name = 'TransfersIntelligenceAgent'
        logger.info(f"[Agent] Initialized {self.name}")

    def analyze(self, input_dict: dict) -> dict:
        start = time.time()
        try:
            lang = input_dict.get('lang', 'en')
            mode = input_dict.get('mode', 'value')
            start_date = input_dict.get('start_date')
            end_date = input_dict.get('end_date')
            result = analyze_transfers(input_dict, mode=mode, start_date=start_date, end_date=end_date)
            result['generated_at'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
            result['agent'] = self.name
            execution_time_ms = (time.time() - start) * 1000
            result['execution_time_ms'] = round(execution_time_ms, 2)
            result = _translate_output(result, lang)
            log_agent_invocation(self.name, input_dict, result, execution_time_ms, success=True)
            return result
        except Exception as e:
            execution_time_ms = (time.time() - start) * 1000
            error_result = {
                'error': str(e),
                'agent': self.name,
                'execution_time_ms': round(execution_time_ms, 2)
            }
            log_agent_invocation(self.name, input_dict, error_result, execution_time_ms, success=False)
            return error_result

class AiChatAgent:
    def __init__(self):
        self.name = 'AiChatAgent'
        logger.info(f"[Agent] Initialized {self.name}")

    def analyze(self, input_dict: dict) -> dict:
        start = time.time()
        try:
            lang = input_dict.get('lang', 'en')
            question = input_dict.get('question', '')

            from app.data.db import get_duckdb_connection
            con = get_duckdb_connection()
            inv_count = con.execute("SELECT COUNT(*) FROM inventory_data").fetchone()[0]
            total_value = con.execute("SELECT COALESCE(SUM(closing_stock * unit_cost), 0) FROM inventory_data").fetchone()[0]
            overstocked = con.execute("SELECT COUNT(*) FROM inventory_data WHERE closing_stock >= 6 * (SELECT COALESCE(AVG(s.quantity_sold), 0.01) FROM sales_data s WHERE s.product_code = inventory_data.product_code) / 30.0").fetchone()[0]
            low = con.execute("SELECT COUNT(*) FROM inventory_data WHERE closing_stock > 0 AND closing_stock < 3 * (SELECT COALESCE(AVG(s.quantity_sold), 0.01) FROM sales_data s WHERE s.product_code = inventory_data.product_code) / 30.0").fetchone()[0]
            out = con.execute("SELECT COUNT(*) FROM inventory_data WHERE closing_stock = 0").fetchone()[0]
            con.close()

            from app.data.db import load_sales_data
            sales_df = load_sales_data()
            alerts_text = ""
            if not sales_df.empty:
                sales_df['date'] = pd.to_datetime(sales_df['date'])
                daily = sales_df.groupby('date')['quantity_sold'].sum().reset_index()
                series = [{'date': row['date'].strftime('%Y-%m-%d'), 'value': float(row['quantity_sold'])} for _, row in daily.iterrows()]
                anomalies = detect_anomalies(series, method='zscore', threshold=2.5).get('anomalies', [])
                for a in anomalies[:5]:
                    alerts_text += f"- Unusual sales on {a['date']}: {a['value']:.0f} units (z={a['score']:.2f})\n"

            from .narrative_generator import generate_narrative
            from .prompts_templates import get_template
            template = get_template('chat', lang)
            context = {
                'total_products': str(inv_count),
                'stock_value': f"{total_value:,.2f}",
                'overstocked_count': str(overstocked),
                'low_stock_count': str(low),
                'out_of_stock_count': str(out),
                'alerts': alerts_text or 'No recent anomalies.',
                'question': question,
            }
            answer = generate_narrative(template, context, lang=lang, max_tokens=800, temperature=0.5)
            if not answer:
                answer = "I'm sorry, I couldn't generate an answer at this time. Please check your AI provider configuration."

            execution_time_ms = (time.time() - start) * 1000
            output = {
                'answer': answer,
                'agent': self.name,
                'execution_time_ms': round(execution_time_ms, 2),
            }
            log_agent_invocation(self.name, input_dict, output, execution_time_ms, success=True)
            return output
        except Exception as e:
            execution_time_ms = (time.time() - start) * 1000
            error_output = {
                'answer': f"Error: {str(e)}",
                'agent': self.name,
                'execution_time_ms': round(execution_time_ms, 2),
            }
            log_agent_invocation(self.name, input_dict, error_output, execution_time_ms, success=False)
            return error_output


class AdvancedAnalyticsAgent:
    def __init__(self):
        self.name = 'AdvancedAnalyticsAgent'
        logger.info(f"[Agent] Initialized {self.name}")

    def analyze(self, input_dict: dict) -> dict:
        start = time.time()
        try:
            lang = input_dict.get('lang', 'en')
            analysis_type = input_dict.get('type', 'abc')  # abc, xyz, fsn, safety_stock, eoq
            result = {}
            if analysis_type == 'safety_stock':
                result = calculate_safety_stock(input_dict, input_dict.get('service_level', 1.645), input_dict.get('lead_time_days', 7))
            elif analysis_type == 'eoq':
                result = calculate_eoq(input_dict, input_dict.get('order_cost', 50.0), input_dict.get('holding_cost_pct', 0.25))
            elif analysis_type == 'abc':
                result = analyze_abc(input_dict)
            elif analysis_type == 'xyz':
                result = analyze_xyz(input_dict)
            elif analysis_type == 'fsn':
                result = analyze_fsn(input_dict)
            else:
                return {'error': f'Unknown analysis type: {analysis_type}'}

            result['generated_at'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
            result['agent'] = self.name
            execution_time_ms = (time.time() - start) * 1000
            result['execution_time_ms'] = round(execution_time_ms, 2)
            result = _translate_output(result, lang)
            log_agent_invocation(self.name, input_dict, result, execution_time_ms, success=True)
            return result
        except Exception as e:
            execution_time_ms = (time.time() - start) * 1000
            error_result = {
                'error': str(e),
                'agent': self.name,
                'execution_time_ms': round(execution_time_ms, 2),
            }
            log_agent_invocation(self.name, input_dict, error_result, execution_time_ms, success=False)
            return error_result


class DataManagementAgent:
    def __init__(self):
        self.name = 'DataManagementAgent'
        logger.info(f"[Agent] Initialized {self.name}")

    def analyze(self, input_dict: dict) -> dict:
        start = time.time()
        try:
            lang = input_dict.get('lang', 'en')
            result = check_data_quality(input_dict)
            result['generated_at'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
            result['agent'] = self.name
            execution_time_ms = (time.time() - start) * 1000
            result['execution_time_ms'] = round(execution_time_ms, 2)
            result = _translate_output(result, lang)
            log_agent_invocation(self.name, input_dict, result, execution_time_ms, success=True)
            return result
        except Exception as e:
            execution_time_ms = (time.time() - start) * 1000
            error_result = {
                'error': str(e),
                'agent': self.name,
                'execution_time_ms': round(execution_time_ms, 2)
            }
            log_agent_invocation(self.name, input_dict, error_result, execution_time_ms, success=False)
            return error_result



