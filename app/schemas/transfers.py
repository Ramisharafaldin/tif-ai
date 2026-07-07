from pydantic import BaseModel
from typing import List, Optional, Literal

class TransferRecommendation(BaseModel):
    product_code: str
    product_name: str
    from_branch: str
    to_branch: str
    quantity: int
    reason: str
    priority: Literal['low', 'medium', 'high']

class TransferAlert(BaseModel):
    type: str
    severity: Literal['low', 'medium', 'high']
    entity: str
    message: str
    recommended_action: str

class TransfersAnalyzeRequest(BaseModel):
    branch_id: Optional[str] = None

class TransfersAnalyzeResponse(BaseModel):
    recommendations: List[TransferRecommendation]
    alerts: List[TransferAlert]
    generated_at: str
    agent: str
    execution_time_ms: float
