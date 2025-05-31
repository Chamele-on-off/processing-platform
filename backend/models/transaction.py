from datetime import datetime
from extensions import db

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='RUB')
    type = db.Column(db.String(20), nullable=False)  # deposit/withdrawal
    status = db.Column(db.String(20), default='pending')
    merchant_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    trader_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    method = db.Column(db.String(50))  # bank_account/card/crypto
    details = db.Column(db.JSON)  # Реквизиты
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    pdf_check_url = db.Column(db.String(255))  # Путь к PDF чеку
    
    @classmethod
    def get_pending_deposits(cls):
        return cls.query.filter_by(type='deposit', status='pending').all()
    
    @classmethod
    def get_pending_payouts(cls):
        return cls.query.filter_by(type='withdrawal', status='pending').all()
    
    @classmethod
    def get_user_transactions(cls, user_id):
        return cls.query.filter(
            (cls.merchant_id == user_id) | (cls.trader_id == user_id)
        ).order_by(cls.created_at.desc()).all()
