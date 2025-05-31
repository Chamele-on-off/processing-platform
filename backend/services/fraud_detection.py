from datetime import datetime, timedelta
from models.transaction import Transaction
from models.user import User
from extensions import db
from utils.notification_service import NotificationService

class FraudDetectionService:
    @staticmethod
    def check_transaction_limit(user_id):
        """Проверка лимита транзакций"""
        hour_ago = datetime.utcnow() - timedelta(hours=1)
        count = Transaction.query.filter(
            Transaction.trader_id == user_id,
            Transaction.created_at >= hour_ago
        ).count()
        return count >= 50  # Максимум 50 транзакций в час

    @staticmethod
    def check_pdf_fraud(pdf_data, transaction):
        """Проверка PDF чека на мошенничество"""
        # 1. Проверка суммы
        if abs(float(pdf_data['amount']) - transaction.amount) > 100:
            return True
        
        # 2. Проверка времени (чек не должен быть старым)
        check_time = datetime.strptime(pdf_data['date'], '%Y-%m-%d %H:%M:%S')
        if (datetime.utcnow() - check_time) > timedelta(hours=24):
            return True
        
        # 3. Проверка повторяющихся отправителей
        same_sender = Transaction.query.filter(
            Transaction.details['sender'].astext == pdf_data['sender'],
            Transaction.trader_id == transaction.trader_id
        ).count()
        
        if same_sender > 3:  # Более 3 чеков от одного отправителя
            return True
        
        return False

    @staticmethod
    def monitor_activity():
        """Мониторинг активности трейдеров"""
        traders = User.query.filter_by(role='trader').all()
        for trader in traders:
            if FraudDetectionService.check_suspicious_activity(trader.id):
                NotificationService.send_alert(
                    f"Suspicious activity detected for trader {trader.id}",
                    'admin'
                )
                trader.is_active = False
                db.session.commit()

    @staticmethod
    def check_suspicious_activity(trader_id):
        """Комплексная проверка активности трейдера"""
        # Проверка смены IP
        # Проверка геолокации
        # Проверка скорости выполнения операций
        # (Реализация зависит от вашей системы трекинга)
        return False
