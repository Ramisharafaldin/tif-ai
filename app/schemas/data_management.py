from pydantic import BaseModel
from typing import List, Optional

class DataQualityIssue(BaseModel):
    table: str
    column: str
    issue: str
    severity: str
    row_count: int

class DataStatus(BaseModel):
    inventory_rows: int
    sales_rows: int
    inventory_columns: int
    sales_columns: int
    has_inventory_data: bool
    has_sales_data: bool
    last_upload: Optional[str] = None

class DataStatusResponse(BaseModel):
    status: DataStatus
    quality_issues: List[DataQualityIssue]
    generated_at: str
    agent: str
