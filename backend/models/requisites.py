from extensions import db
from models.user import User

class Requisite(db.Model):
    __tablename__ = 'requisites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # bank_account/card/crypto
    details = db.Column(db.JSON, nullable=False)     # {account: ..., bank: ...}
    is_active = db.Column(db.Boolean, default=True)
    max_amount = db.Column(db.Float)                 # Макс. сумма для этого реквизита
    min_amount = db.Column(db.Float, default=0)      # Мин. сумма
    currency = db.Column(db.String(3), default='RUB')
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    # Связи
    user = db.relationship('User', back_populates='requisites')
    
    @classmethod
    def get_active_for_trader(cls, trader_id):
        return cls.query.filter_by(
            user_id=trader_id,
            is_active=True
        ).order_by(cls.max_amount.desc()).all()
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'details': self.details,
            'max_amount': self.max_amount,
            'min_amount': self.min_amount,
            'currency': self.currency,
            'is_active': self.is_active
        }
