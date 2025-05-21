from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "postgresql://user:pass@db:5432/dev_db"
engine = create_engine(DATABASE_URL)
Base = declarative_base()
