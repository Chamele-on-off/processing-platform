from sqlalchemy import Column, Integer, String, Float
from app.db import Base
from pydantic import BaseModel

class Transaction(BaseModel):
    id: UUID
    amount: float
    status: str
    merchant_id: int