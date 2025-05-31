from datetime import datetime
from extensions import db
from models.transaction import Transaction
from models.user import User

class Dispute(db.Model):
    __tablename__ = 'disputes'
    
    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transactions.id'))
    initiator_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='open')  # open/resolved/rejected
    resolution = db.Column(db.Text)
    resolved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    
    # Связи
    transaction = db.relationship('Transaction', backref='disputes')
    initiator = db.relationship('User', foreign_keys=[initiator_id])
    resolver = db.relationship('User', foreign_keys=[resolved_by])
    
    @classmethod
    def create_from_transaction(cls, transaction_id, user_id, reason):
        dispute = cls(
            transaction_id=transaction_id,
            initiator_id=user_id,
            reason=reason
        )
        db.session.add(dispute)
        
        # Обновление статуса транзакции
        transaction = Transaction.query.get(transaction_id)
        transaction.status = 'disputed'
        
        db.session.commit()
        return dispute
    
    def resolve(self, admin_id, resolution, status='resolved'):
        self.status = status
        self.resolution = resolution
        self.resolved_by = admin_id
        self.resolved_at = datetime.utcnow()
        
        if status == 'resolved':
            self.transaction.status = 'completed'
        else:
            self.transaction.status = 'failed'
        
        db.session.commit()
    
    def to_dict(self):
        return {
            'id': self.id,
            'transaction_id': self.transaction_id,
            'initiator': self.initiator.to_dict() if self.initiator else None,
            'reason': self.reason,
            'status': self.status,
            'resolution': self.resolution,
            'resolved_by': self.resolver.to_dict() if self.resolver else None,
            'created_at': self.created_at.isoformat(),
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None
        }
