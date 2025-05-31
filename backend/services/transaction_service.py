from datetime import datetime
from models.transaction import Transaction
from models.triangle import TriangleTransaction
from models.user import User
from extensions import db
from utils.currency_rates import get_currency_rate

class TransactionService:
    @staticmethod
    def create_transaction(data, user):
        """Создание новой транзакции с проверкой антифрод"""
        from utils.antifraud import FraudDetection
        
        if FraudDetection.check_transaction_limit(user.id):
            raise ValueError("Transaction limit exceeded")
        
        transaction = Transaction(
            amount=data['amount'],
            currency=data.get('currency', 'RUB'),
            type=data['type'],
            merchant_id=data.get('merchant_id'),
            trader_id=data.get('trader_id'),
            method=data['method'],
            details=data.get('details'),
            status='pending'
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        # Автоматический матчинг для треугольных транзакций
        if transaction.type == 'deposit':
            TransactionService.try_match_triangle(transaction)
        
        return transaction

    @staticmethod
    def try_match_triangle(deposit):
        """Попытка создания треугольной транзакции"""
        payout = Transaction.query.filter_by(
            type='withdrawal',
            status='pending',
            currency=deposit.currency
        ).order_by(Transaction.created_at).first()
        
        if payout and deposit.amount >= payout.amount * 0.9:  # 90% совпадение
            triangle = TriangleTransaction(
                deposit_ids=[deposit.id],
                payout_id=payout.id,
                amount=min(deposit.amount, payout.amount),
                status='completed'
            )
            
            deposit.status = 'completed'
            payout.status = 'completed'
            
            db.session.add(triangle)
            db.session.commit()
            
            # Уведомления для участников
            NotificationService.notify_triangle_created(
                triangle, 
                [deposit.merchant_id, payout.trader_id]
            )
            
            return triangle
        return None

    @staticmethod
    def get_user_transactions(user_id, role):
        """Получение транзакций с учетом роли пользователя"""
        query = Transaction.query
        if role == 'merchant':
            query = query.filter_by(merchant_id=user_id)
        elif role == 'trader':
            query = query.filter_by(trader_id=user_id)
        
        return query.order_by(Transaction.created_at.desc()).all()

    @staticmethod
    def upload_pdf_check(transaction_id, file):
        """Загрузка PDF чека с проверкой"""
        from utils.pdf_processor import process_pdf_check
        
        transaction = Transaction.query.get_or_404(transaction_id)
        check_data = process_pdf_check(file)
        
        if abs(check_data['amount'] - transaction.amount) > 100:  # Допуск 100 руб
            raise ValueError("Amount in PDF doesn't match transaction")
        
        transaction.pdf_check_url = f"checks/{transaction_id}.pdf"
        transaction.status = 'completed'
        db.session.commit()
        
        return transaction
