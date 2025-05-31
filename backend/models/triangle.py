from datetime import datetime
from extensions import db
from models.transaction import Transaction
from services.notification_service import NotificationService

class TriangleTransaction(db.Model):
    __tablename__ = 'triangle_transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    deposit_ids = db.Column(db.JSON, nullable=False)  # JSON array of deposit IDs
    payout_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    @property
    def deposits(self):
        return Transaction.query.filter(Transaction.id.in_(self.deposit_ids)).all()
    
    @property
    def payout(self):
        return Transaction.query.get(self.payout_id)
    
    @classmethod
    def create_from_matching(cls, payout, deposits):
        """Создание треугольной транзакции при совпадении"""
        triangle = cls(
            deposit_ids=[d.id for d in deposits],
            payout_id=payout.id,
            amount=sum(d.amount for d in deposits),
            status='completed'
        )
        
        # Обновление статусов транзакций
        for deposit in deposits:
            deposit.status = 'completed'
            db.session.add(deposit)
        
        payout.status = 'completed'
        db.session.add(payout)
        
        db.session.add(triangle)
        db.session.commit()
        
        # Уведомления для фронтенда
        NotificationService.notify_triangle_created(
            triangle,
            [payout.trader_id] + [d.merchant_id for d in deposits]
        )
        
        return triangle
    
    def to_dict(self):
        return {
            'id': self.id,
            'deposit_ids': self.deposit_ids,
            'payout_id': self.payout_id,
            'amount': self.amount,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
