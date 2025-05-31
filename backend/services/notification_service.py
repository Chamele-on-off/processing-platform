from extensions import socketio
from models.user import User
from datetime import datetime

class NotificationService:
    @staticmethod
    def send_notification(user_id, message, notification_type='info'):
        """Отправка уведомления через WebSocket"""
        socketio.emit('notification', {
            'user_id': user_id,
            'message': message,
            'type': notification_type,
            'timestamp': datetime.utcnow().isoformat(),
            'read': False
        }, room=str(user_id))

    @staticmethod
    def notify_new_transaction(transaction):
        """Уведомление о новой транзакции"""
        if transaction.type == 'deposit':
            recipients = User.get_available_traders()
            message = f"New deposit: {transaction.amount} {transaction.currency}"
        else:
            recipients = [transaction.merchant]
            message = f"New withdrawal: {transaction.amount} {transaction.currency}"
        
        for user in recipients:
            NotificationService.send_notification(
                user.id,
                message,
                'new_transaction'
            )

    @staticmethod
    def notify_triangle_created(triangle, user_ids):
        """Уведомление о треугольной транзакции"""
        for user_id in user_ids:
            NotificationService.send_notification(
                user_id,
                f"Triangle transaction completed: {triangle.amount}",
                'triangle'
            )

    @staticmethod
    def send_alert(message, recipient_role='admin'):
        """Отправка алерта админам или трейдерам"""
        recipients = User.query.filter_by(role=recipient_role).all()
        for user in recipients:
            socketio.emit('alert', {
                'message': message,
                'timestamp': datetime.utcnow().isoformat()
            }, room=str(user.id))
