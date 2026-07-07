from pydantic import BaseModel
from typing import List, Optional, Union, Literal

class InventoryItem(BaseModel):
    product_code: str
    product_name: str
    category: str
    branch_code: str
    branch_name: str
    closing_stock: int
    unit_cost: float
    stock_value: float
    status: Literal['overstocked', 'normal', 'low', 'out_of_stock']

class InventorySummary(BaseModel):
    total_products: int
    total_stock_value: float
    total_items: int
    overstocked_count: int
    low_stock_count: int
    out_of_stock_count: int

class InventoryAlert(BaseModel):
    type: str
    severity: Literal['low', 'medium', 'high']
    entity: str
    message: str
    recommended_action: str

class InventoryAnalyzeRequest(BaseModel):
    branch_id: Optional[str] = None
    category: Optional[str] = None

class InventoryAnalyzeResponse(BaseModel):
    summary: InventorySummary
    items: List[InventoryItem]
    alerts: List[InventoryAlert]
    generated_at: str
    agent: str
    execution_time_ms: float
