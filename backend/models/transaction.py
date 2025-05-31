from datetime import datetime
from enum import Enum
from extensions import db

class TransactionStatus(Enum):
    PENDING = 'pending'
    COMPLETED = 'completed'
    FAILED = 'failed'
    DISPUTED = 'disputed'

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='RUB')
    type = db.Column(db.String(20), nullable=False)  # deposit/withdrawal
    status = db.Column(db.String(20), default=TransactionStatus.PENDING.value)
    merchant_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    trader_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    method = db.Column(db.String(50))  # bank_account/card/crypto
    details = db.Column(db.JSON)  # Реквизиты
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    pdf_check_url = db.Column(db.String(255))
    processing_time = db.Column(db.Integer)  # В секундах

    # Связи
    disputes = db.relationship('Dispute', back_populates='transaction')
    triangle_as_payout = db.relationship('TriangleTransaction', foreign_keys='TriangleTransaction.payout_id', backref='payout_transaction')
    triangle_as_deposit = db.relationship('TriangleTransaction', foreign_keys='TriangleTransaction.deposit_ids', backref='deposit_transactions')

    @classmethod
    def create(cls, data, commit=True):
        transaction = cls(**data)
        db.session.add(transaction)
        if commit:
            db.session.commit()
        return transaction

    @classmethod
    def get_pending_deposits(cls):
        return cls.query.filter_by(
            type='deposit',
            status=TransactionStatus.PENDING.value
        ).order_by(cls.created_at).all()

    @classmethod
    def get_pending_payouts(cls):
        return cls.query.filter_by(
            type='withdrawal',
            status=TransactionStatus.PENDING.value
        ).order_by(cls.created_at).all()

    @classmethod
    def get_user_transactions(cls, user_id, role):
        query = cls.query
        if role == 'merchant':
            query = query.filter_by(merchant_id=user_id)
        elif role == 'trader':
            query = query.filter_by(trader_id=user_id)
        return query.order_by(cls.created_at.desc()).all()

    def complete(self, processing_time=None):
        self.status = TransactionStatus.COMPLETED.value
        self.updated_at = datetime.utcnow()
        if processing_time:
            self.processing_time = processing_time
        db.session.commit()

    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'currency': self.currency,
            'type': self.type,
            'status': self.status,
            'merchant_id': self.merchant_id,
            'trader_id': self.trader_id,
            'method': self.method,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'processing_time': self.processing_time
        }
