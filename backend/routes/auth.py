from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user import User
from extensions import db
from utils.audit_log import AuditLog

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.authenticate(data['email'], data['password'])
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account disabled'}), 403
    
    # Логирование входа
    AuditLog.log_action(
        user.id,
        'login',
        request=request
    )
    
    user.update_activity(request.remote_addr)
    
    return jsonify({
        'token': user.generate_token(),
        'user': user.to_dict()
    })

@bp.route('/refresh', methods=['POST'])
def refresh():
    # Реализация обновления токена
    pass
