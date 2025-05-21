from sqlalchemy import Column, Integer, String, Float
from app.db import Base

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    amount = Column(Float)
    status = Column(String)
    merchant_id = Column(Integer)
