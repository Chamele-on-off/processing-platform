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
        emit('auth_success
