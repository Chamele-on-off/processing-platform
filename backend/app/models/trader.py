from sqlalchemy import Column, Float, String, Boolean
from app.db import Base

class Trader(Base):
    __tablename__ = "traders"
    id = Column(Integer, primary_key=True)
    balance = Column(Float, default=0.0)
    insurance_deposit = Column(Float, default=0.0)
    rate_in = Column(Float)  # Ставка на вход (например, 1.02 для 2% комиссии)
    rate_out = Column(Float) # Ставка на выход
    is_active = Column(Boolean, default=True)
    last_ip = Column(String)
    last_geo = Column(String)
