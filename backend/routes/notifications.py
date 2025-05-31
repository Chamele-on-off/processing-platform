from flask_socketio import emit
from extensions import socketio
from models.user import User

@socketio.on('connect')
def handle_connect():
    emit('connected', {'status': 'ok'})

@socketio.on('authenticate')
def handle_auth(data):
    user = User.verify_jwt(data['token'])
    if user:
        emit('auth_success', {'user_id': user.id})
    else:
        emit('auth_failed')

def send_notification(user_id, message):
    socketio.emit('notification', {
        'user_id': user_id,
        'message': message,
        'timestamp': datetime.utcnow().isoformat()
    }, room=str(user_id))
