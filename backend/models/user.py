from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin/trader/merchant
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    ip_address = db.Column(db.String(45))
    geo_location = db.Column(db.String(100))
    balance = db.Column(db.Float, default=0.0)
    insurance_deposit = db.Column(db.Float, default=0.0)  # Страховой депозит
    
    # Связи
    transactions = db.relationship('Transaction', foreign_keys='Transaction.merchant_id')
    trader_transactions = db.relationship('Transaction', foreign_keys='Transaction.trader_id')
    requisites = db.relationship('Requisite', backref='user')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_token(self):
        return create_access_token(identity={
            'id': self.id,
            'email': self.email,
            'role': self.role
        })
    
    @classmethod
    def get_available_traders(cls):
        """Получение активных трейдеров с учетом приоритетов"""
        return cls.query.filter_by(
            role='trader',
            is_active=True
        ).order_by(
            cls.insurance_deposit.desc()  # Сначала трейдеры с большим депозитом
        ).all()
    
    @classmethod
    def authenticate(cls, email, password):
        user = cls.query.filter_by(email=email).first()
        if user and user.check_password(password):
            user.last_login = datetime.utcnow()
            db.session.commit()
            return user
        return None
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'balance': self.balance,
            'insurance_deposit': self.insurance_deposit,
            'is_active': self.is_active
        }
