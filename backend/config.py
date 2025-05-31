import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://user:pass@localhost/processing')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    JWT_REFRESH_TOKEN_EXPIRES = 86400
    MAX_TRANSACTIONS_PER_HOUR = 50
    MAX_AMOUNT_PER_TRANSACTION = 1000000
    PDF_CHECK_FOLDER = 'checks'
    TG_BOT_TOKEN = os.getenv('TG_BOT_TOKEN')
