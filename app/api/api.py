from fastapi import APIRouter, HTTPException
from app.services.agents import DashboardIntelligenceAgent
from app.schemas.dashboard import DashboardAnalyzeRequest, DashboardAnalyzeResponse

api_router = APIRouter()
agent = DashboardIntelligenceAgent()

@api_router.get('/dashboard', tags=['dashboard'])
async def get_dashboard():
    return {'message': 'Dashboard endpoint - to be implemented'}

@api_router.post('/dashboard/analyze', tags=['dashboard'])
async def analyze_dashboard(payload: DashboardAnalyzeRequest):
    '''
    Expects JSON body with optional fields:
    - branch_id (string)
    - date_range: {start: 'YYYY-MM-DD', end: 'YYYY-MM-DD'}
    - category (string)
    - product_id (string)
    - include_kpis, include_alerts, include_insights (booleans)
    '''
    try:
        result = agent.analyze(payload.dict())
        # If there's an error key, raise HTTPException
        if 'error' in result:
            raise HTTPException(status_code=500, detail=result['error'])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get('/inventory', tags=['inventory'])
async def get_inventory():
    return {'message': 'Inventory endpoint - to be implemented'}

@api_router.post('/inventory/analyze', tags=['inventory'])
async def analyze_inventory():
    return {'message': 'Inventory analysis - to be implemented'}

@api_router.get('/forecasting', tags=['forecasting'])
async def get_forecasting():
    return {'message': 'Forecasting endpoint - to be implemented'}

@api_router.post('/forecasting/run', tags=['forecasting'])
async def run_forecast():
    return {'message': 'Run forecast - to be implemented'}

@api_router.get('/transfers', tags=['transfers'])
async def get_transfers():
    return {'message': 'Transfers endpoint - to be implemented'}

@api_router.post('/transfers/analyze', tags=['transfers'])
async def analyze_transfers():
    return {'message': 'Analyze transfers - to be implemented'}

@api_router.get('/data/status', tags=['data'])
async def data_status():
    return {'message': 'Data status - to be implemented'}

@api_router.post('/data/reload', tags=['data'])
async def reload_data():
    return {'message': 'Reload data - to be implemented'}

@api_router.get('/agents/status', tags=['agents'])
async def agents_status():
    return {'message': 'Agents status - to be implemented'}
