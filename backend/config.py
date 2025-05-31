import os
from datetime import timedelta

class Config:
    # Базовые настройки
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    
    # База данных
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://user:pass@localhost/processing')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Безопасность
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    JWT_COOKIE_SECURE = os.getenv('FLASK_ENV') == 'production'
    JWT_COOKIE_CSRF_PROTECT = True
    
    # Лимиты
    MAX_TRANSACTIONS_PER_HOUR = 50
    MAX_AMOUNT_PER_TRANSACTION = 1000000  # 1 млн руб
    
    # Пути
    PDF_CHECK_FOLDER = os.path.join(os.path.dirname(__file__), 'checks')
    
    # API ключи
    EXCHANGE_RATE_API_KEY = os.getenv('EXCHANGE_RATE_API_KEY', 'demo-key')
    TG_BOT_TOKEN = os.getenv('TG_BOT_TOKEN')
    
    # Настройки треугольных транзакций
    TRIANGLE_MATCH_THRESHOLD = 0.9  # 90% совпадение суммы
    
    # Настройки антифрода
    FRAUD_CHECK_INTERVAL = 300  # 5 минут
    MAX_SAME_SENDER_CHECKS = 3
    
    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    JWT_COOKIE_SECURE = False

class ProductionConfig(Config):
    DEBUG = False
    JWT_COOKIE_SECURE = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
