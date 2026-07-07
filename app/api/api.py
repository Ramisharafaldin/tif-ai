from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import io, csv
from app.services.agents import (
    DashboardIntelligenceAgent,
    InventoryIntelligenceAgent,
    ForecastingIntelligenceAgent,
    TransfersIntelligenceAgent,
    DataManagementAgent,
    AiChatAgent,
    AdvancedAnalyticsAgent,
)
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.dashboard import DashboardAnalyzeRequest
from app.schemas.inventory import InventoryAnalyzeRequest
from app.schemas.forecasting import ForecastingRunRequest
from app.schemas.transfers import TransfersAnalyzeRequest
from app.schemas.data_management import DataStatusResponse
from app.schemas.analytics import SafetyStockRequest, SafetyStockResponse, EoqRequest, EoqResponse
from app.data.db import load_inventory_data, load_sales_data, init_db, get_all_products, create_product, update_product, delete_product
from app.data.settings_store import load_providers, save_providers, get_providers_masked, reset_defaults, DEFAULT_PROVIDERS
from app.services.auth import require_role
from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    product_code: str
    product_name: str
    category: str
    unit_cost: float
    unit_price: float

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    category: Optional[str] = None
    unit_cost: Optional[float] = None
    unit_price: Optional[float] = None

api_router = APIRouter()

dashboard_agent = DashboardIntelligenceAgent()
inventory_agent = InventoryIntelligenceAgent()
forecasting_agent = ForecastingIntelligenceAgent()
transfers_agent = TransfersIntelligenceAgent()
data_agent = DataManagementAgent()
ai_chat_agent = AiChatAgent()
analytics_agent = AdvancedAnalyticsAgent()

@api_router.get('/dashboard', tags=['dashboard'])
async def get_dashboard(lang: str = 'en', start_date: str = None, end_date: str = None, narrative: bool = False):
    result = dashboard_agent.analyze({'lang': lang, 'start_date': start_date, 'end_date': end_date, 'include_narrative': narrative})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.post('/dashboard/analyze', tags=['dashboard'])
async def analyze_dashboard(payload: DashboardAnalyzeRequest, lang: str = 'en'):
    try:
        payload_dict = payload.model_dump()
        payload_dict['lang'] = lang
        result = dashboard_agent.analyze(payload_dict)
        if 'error' in result:
            raise HTTPException(status_code=500, detail=result['error'])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get('/inventory', tags=['inventory'])
async def get_inventory(lang: str = 'en', mode: str = 'value', start_date: str = None, end_date: str = None, target_days: int = 30):
    result = inventory_agent.analyze({'lang': lang, 'mode': mode, 'start_date': start_date, 'end_date': end_date, 'target_days': target_days})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.post('/inventory/analyze', tags=['inventory'])
async def analyze_inventory(payload: InventoryAnalyzeRequest):
    try:
        result = inventory_agent.analyze(payload.model_dump())
        if 'error' in result:
            raise HTTPException(status_code=500, detail=result['error'])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get('/forecasting', tags=['forecasting'])
async def get_forecasting(lang: str = 'en', mode: str = 'quantity', start_date: str = None, end_date: str = None):
    result = forecasting_agent.analyze({'period_days': 30, 'lang': lang, 'mode': mode, 'start_date': start_date, 'end_date': end_date})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.post('/forecasting/run', tags=['forecasting'])
async def run_forecast(payload: ForecastingRunRequest):
    try:
        result = forecasting_agent.analyze(payload.model_dump())
        if 'error' in result:
            raise HTTPException(status_code=500, detail=result['error'])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get('/transfers', tags=['transfers'])
async def get_transfers(lang: str = 'en', mode: str = 'value', start_date: str = None, end_date: str = None):
    result = transfers_agent.analyze({'lang': lang, 'mode': mode, 'start_date': start_date, 'end_date': end_date})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.post('/transfers/analyze', tags=['transfers'])
async def analyze_transfers(payload: TransfersAnalyzeRequest):
    try:
        result = transfers_agent.analyze(payload.model_dump())
        if 'error' in result:
            raise HTTPException(status_code=500, detail=result['error'])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get('/data/status', tags=['data'])
async def data_status():
    try:
        result = data_agent.analyze({})
        if 'error' in result:
            raise HTTPException(status_code=500, detail=result['error'])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post('/data/reload', tags=['data'])
async def reload_data():
    try:
        init_db()
        load_inventory_data()
        load_sales_data()
        return {'message': 'Data reloaded successfully', 'status': 'ok'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get('/inventory/products', tags=['inventory'])
async def list_products():
    return get_all_products()

@api_router.post('/inventory/products', tags=['inventory'], status_code=201)
async def add_product(payload: ProductCreate, user: dict = Depends(require_role('admin', 'manager'))):
    existing = get_all_products()
    if any(p['product_code'] == payload.product_code for p in existing):
        raise HTTPException(status_code=400, detail='Product code already exists')
    return create_product(payload.product_code, payload.product_name, payload.category, payload.unit_cost, payload.unit_price)

@api_router.put('/inventory/products/{code}', tags=['inventory'])
async def edit_product(code: str, payload: ProductUpdate, user: dict = Depends(require_role('admin', 'manager'))):
    result = update_product(code, payload.product_name, payload.category, payload.unit_cost, payload.unit_price)
    if not result:
        raise HTTPException(status_code=404, detail='Product not found')
    return result

@api_router.delete('/inventory/products/{code}', tags=['inventory'])
async def remove_product(code: str, user: dict = Depends(require_role('admin'))):
    if not delete_product(code):
        raise HTTPException(status_code=404, detail='Product not found')
    return {'message': 'Product deleted', 'product_code': code}

@api_router.get('/admin/users', tags=['admin'])
async def admin_list_users(user: dict = Depends(require_role('admin'))):
    from app.data.db import get_duckdb_connection
    con = get_duckdb_connection()
    rows = con.execute("SELECT id, username, email, full_name, role, is_active, created_at FROM users").fetchall()
    con.close()
    return [{'id': r[0], 'username': r[1], 'email': r[2], 'full_name': r[3], 'role': r[4], 'is_active': r[5], 'created_at': r[6]} for r in rows]

@api_router.get('/admin/stats', tags=['admin'])
async def admin_stats(user: dict = Depends(require_role('admin'))):
    from app.data.db import get_duckdb_connection, load_inventory_data
    con = get_duckdb_connection()
    inv_count = con.execute("SELECT COUNT(*) FROM inventory_data").fetchone()[0]
    sales_count = con.execute("SELECT COUNT(*) FROM sales_data").fetchone()[0]
    prod_count = con.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    user_count = con.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    audit_count = con.execute("SELECT COUNT(*) FROM audit_log").fetchone()[0]
    con.close()
    return {'inventory_rows': inv_count, 'sales_rows': sales_count, 'products': prod_count, 'users': user_count, 'audit_logs': audit_count}

@api_router.get('/export/inventory/csv', tags=['export'])
async def export_inventory_csv():
    from app.data.db import get_duckdb_connection
    con = get_duckdb_connection()
    rows = con.execute("SELECT * FROM inventory_data").fetchall()
    cols = [desc[0] for desc in con.description]
    con.close()
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(cols)
    w.writerows(rows)
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=inventory_export.csv'})

@api_router.get('/export/inventory/excel', tags=['export'])
async def export_inventory_excel():
    from app.data.db import get_duckdb_connection
    from openpyxl import Workbook
    con = get_duckdb_connection()
    rows = con.execute("SELECT * FROM inventory_data").fetchall()
    cols = [desc[0] for desc in con.description]
    con.close()
    wb = Workbook()
    ws = wb.active
    ws.title = 'Inventory'
    ws.append(cols)
    for r in rows:
        ws.append(list(r))
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={'Content-Disposition': 'attachment; filename=inventory_export.xlsx'})

@api_router.post('/notify/test', tags=['notifications'])
async def test_notification(message: str = 'Test notification from TIF-AI'):
    from app.services.notifications import notify_clients, connected_clients as ws_clients
    await notify_clients({'type': 'test', 'message': message, 'severity': 'info'})
    return {'sent': True, 'clients': len(ws_clients)}

@api_router.get('/analytics/safety-stock', tags=['analytics'])
async def get_safety_stock(service_level: float = 1.645, lead_time_days: int = 7):
    result = analytics_agent.analyze({'type': 'safety_stock', 'service_level': service_level, 'lead_time_days': lead_time_days})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.post('/analytics/safety-stock', tags=['analytics'])
async def calc_safety_stock(payload: SafetyStockRequest):
    result = analytics_agent.analyze({'type': 'safety_stock', 'service_level': payload.service_level, 'lead_time_days': payload.lead_time_days})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.get('/analytics/eoq', tags=['analytics'])
async def get_eoq(order_cost: float = 50.0, holding_cost_pct: float = 0.25):
    result = analytics_agent.analyze({'type': 'eoq', 'order_cost': order_cost, 'holding_cost_pct': holding_cost_pct})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.post('/analytics/eoq', tags=['analytics'])
async def calc_eoq(payload: EoqRequest):
    result = analytics_agent.analyze({'type': 'eoq', 'order_cost': payload.order_cost, 'holding_cost_pct': payload.holding_cost_pct})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.get('/analytics/abc', tags=['analytics'])
async def get_abc():
    result = analytics_agent.analyze({'type': 'abc'})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.get('/analytics/xyz', tags=['analytics'])
async def get_xyz():
    result = analytics_agent.analyze({'type': 'xyz'})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.get('/analytics/fsn', tags=['analytics'])
async def get_fsn():
    result = analytics_agent.analyze({'type': 'fsn'})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@api_router.get('/agents/status', tags=['agents'])
async def agents_status():
    agents_info = {
        'agents': [
            {'name': 'DashboardIntelligenceAgent', 'status': 'active', 'description': 'Dashboard KPIs, alerts, and insights'},
            {'name': 'InventoryIntelligenceAgent', 'status': 'active', 'description': 'Inventory analysis and stock status'},
            {'name': 'ForecastingIntelligenceAgent', 'status': 'active', 'description': 'Demand forecasting'},
            {'name': 'TransfersIntelligenceAgent', 'status': 'active', 'description': 'Stock transfer recommendations'},
            {'name': 'DataManagementAgent', 'status': 'active', 'description': 'Data quality and validation'},
            {'name': 'AiChatAgent', 'status': 'active', 'description': 'AI-powered natural language chat'},
            {'name': 'AdvancedAnalyticsAgent', 'status': 'active', 'description': 'Safety Stock, EOQ, ABC/XYZ/FSN analysis'},
        ],
        'total_agents': 7,
    }
    return agents_info

@api_router.post('/ai/chat', tags=['ai'], response_model=ChatResponse)
async def ai_chat(payload: ChatRequest):
    result = ai_chat_agent.analyze({'question': payload.question, 'lang': payload.lang})
    if 'error' in result:
        raise HTTPException(status_code=500, detail=result['error'])
    return ChatResponse(answer=result.get('answer', ''), agent=result.get('agent', 'AiChatAgent'))

@api_router.get('/settings', tags=['settings'])
async def get_settings():
    return {'providers': get_providers_masked()}

@api_router.put('/settings', tags=['settings'])
async def save_settings(payload: dict, user: dict = Depends(require_role('admin'))):
    providers = payload.get('providers', [])
    save_providers(providers)
    return {'providers': get_providers_masked(), 'status': 'saved'}

@api_router.post('/settings/reset-defaults', tags=['settings'])
async def reset_settings_defaults(user: dict = Depends(require_role('admin'))):
    providers = reset_defaults()
    return {'providers': providers, 'status': 'reset'}

@api_router.post('/settings/test-connection', tags=['settings'])
async def test_connection(payload: dict):
    import requests
    base_url = payload.get('baseUrl', '').rstrip('/')
    api_key = payload.get('apiKey', '')
    model = payload.get('model', '')
    provider_id = payload.get('id', '')
    try:
        if provider_id == 'ollama':
            r = requests.get(f'{base_url}/api/tags', timeout=10)
            if r.status_code == 200:
                return {'success': True, 'message': 'Connected Successfully'}
            return {'success': False, 'message': f'Ollama returned status {r.status_code}'}
        elif provider_id == 'google':
            r = requests.post(
                f'{base_url}/models/{model}:generateContent',
                json={'contents': [{'parts': [{'text': 'hi'}]}]},
                params={'key': api_key},
                timeout=10,
            )
            if r.status_code in (200, 400):
                return {'success': True, 'message': 'Connected Successfully'}
            return {'success': False, 'message': f'Google AI returned status {r.status_code}: {r.text[:200]}'}
        elif provider_id == 'anthropic':
            r = requests.post(
                f'{base_url}/messages',
                json={'model': model or 'claude-sonnet-4', 'max_tokens': 10, 'messages': [{'role': 'user', 'content': 'hi'}]},
                headers={'x-api-key': api_key, 'anthropic-version': '2023-06-01'},
                timeout=10,
            )
            if r.status_code in (200, 400):
                return {'success': True, 'message': 'Connected Successfully'}
            return {'success': False, 'message': f'Anthropic returned status {r.status_code}: {r.text[:200]}'}
        else:
            headers = {'Content-Type': 'application/json'}
            if api_key:
                headers['Authorization'] = f'Bearer {api_key}'
            r = requests.post(
                f'{base_url}/chat/completions',
                json={'model': model or 'gpt-3.5-turbo', 'messages': [{'role': 'user', 'content': 'hi'}], 'max_tokens': 5},
                headers=headers,
                timeout=10,
            )
            if r.status_code == 200:
                return {'success': True, 'message': 'Connected Successfully'}
            return {'success': False, 'message': f'API returned status {r.status_code}: {r.text[:300]}'}
    except requests.exceptions.ConnectionError:
        return {'success': False, 'message': f'Connection refused. Check Base URL: {base_url}'}
    except requests.exceptions.Timeout:
        return {'success': False, 'message': 'Connection timed out. Check Base URL and network.'}
    except Exception as e:
        return {'success': False, 'message': str(e)[:300]}

@api_router.post('/settings/fetch-models', tags=['settings'])
async def fetch_models(payload: dict):
    import requests
    base_url = payload.get('baseUrl', '').rstrip('/')
    api_key = payload.get('apiKey', '')
    provider_id = payload.get('id', '')
    try:
        if provider_id == 'ollama':
            r = requests.get(f'{base_url}/api/tags', timeout=10)
            if r.status_code == 200:
                models = [m['name'] for m in r.json().get('models', [])]
                return {'models': models}
            return {'models': [], 'error': f'Ollama returned status {r.status_code}'}
        else:
            if not base_url:
                return {'models': [], 'error': 'Base URL is required'}
            headers = {}
            if api_key:
                headers['Authorization'] = f'Bearer {api_key}'
            r = requests.get(f'{base_url}/models', headers=headers, timeout=10)
            if r.status_code == 200:
                data = r.json()
                models = [m['id'] for m in data.get('data', [])]
                return {'models': models}
            return {'models': [], 'error': f'API returned status {r.status_code}: {r.text[:200]}'}
    except Exception as e:
        return {'models': [], 'error': str(e)[:300]}
