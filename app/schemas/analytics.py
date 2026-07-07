from pydantic import BaseModel
from typing import Optional


class SafetyStockRequest(BaseModel):
    service_level: float = 1.645
    lead_time_days: int = 7

class SafetyStockResponse(BaseModel):
    items: list
    summary: dict


class EoqRequest(BaseModel):
    order_cost: float = 50.0
    holding_cost_pct: float = 0.25

class EoqResponse(BaseModel):
    items: list
    summary: dict


class AbcResponse(BaseModel):
    categories: dict
    summary: dict


class XyzResponse(BaseModel):
    categories: dict
    summary: dict


class FsnResponse(BaseModel):
    categories: dict
    summary: dict
