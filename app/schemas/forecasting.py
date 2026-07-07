from pydantic import BaseModel
from typing import List, Optional

class ForecastItem(BaseModel):
    product_code: str
    product_name: str
    branch_code: str
    historical_avg_sales: float
    forecast_qty: float
    confidence: float
    trend: str

class ForecastPeriod(BaseModel):
    start_date: str
    end_date: str
    total_forecast_qty: float
    total_forecast_value: float

class ForecastingRunRequest(BaseModel):
    branch_id: Optional[str] = None
    category: Optional[str] = None
    period_days: int = 30

class ForecastingRunResponse(BaseModel):
    period: ForecastPeriod
    items: List[ForecastItem]
    generated_at: str
    agent: str
    execution_time_ms: float
