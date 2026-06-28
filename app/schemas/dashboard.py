from pydantic import BaseModel, Field
from typing import List, Optional, Union, Literal

class KPIItem(BaseModel):
    name: str
    value: Union[int, float]
    format: Literal['currency', 'number', 'percent']
    trend: Literal['up', 'down', 'stable']
    explanation: str

class AlertItem(BaseModel):
    type: str
    severity: Literal['low', 'medium', 'high']
    entity: str
    message: str
    recommended_action: str

class InsightItem(BaseModel):
    title: str
    description: str
    confidence: float = Field(..., ge=0, le=1)
    recommended_action: str

class DashboardAnalyzeRequest(BaseModel):
    branch_id: Optional[str] = None
    date_range: Optional[dict] = None  # could be more specific
    category: Optional[str] = None
    product_id: Optional[str] = None
    include_kpis: bool = True
    include_alerts: bool = True
    include_insights: bool = True

class DashboardAnalyzeResponse(BaseModel):
    kpis: List[KPIItem]
    alerts: List[AlertItem]
    insights: List[InsightItem]
    generated_at: str
    agent: str
    execution_time_ms: float
