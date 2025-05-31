from models.transaction import Transaction
from models.user import User
from datetime import datetime, timedelta

class FraudDetection:
    @staticmethod
    def check_transaction(transaction):
        checks = [
            FraudDetection.check_amount(transaction.amount),
            FraudDetection.check_frequency(transaction.trader_id),
            FraudDetection.check_pdf(transaction),
            FraudDetection.check_ip(transaction.trader_id)
        ]
        return any(checks)
    
    @staticmethod
    def check_amount(amount):
        return amount > 1000000  # Пример проверки
    
    @staticmethod
    def check_frequency(trader_id):
        hour_ago = datetime.utcnow() - timedelta(hours=1)
        count = Transaction.query.filter(
            Transaction.trader_id == trader_id,
            Transaction.created_at >= hour_ago
        ).count()
        return count > 50
