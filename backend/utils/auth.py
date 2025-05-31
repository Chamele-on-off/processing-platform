from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps
from models.user import User
from extensions import db

def get_current_user():
    """Получение текущего пользователя из JWT"""
    verify_jwt_in_request()
    jwt_data = get_jwt()
    return User.query.get(jwt_data['sub']['id'])

def sync_user_activity(f):
    """Декоратор для синхронизации активности пользователя"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if user:
            user.update_activity(request.remote_addr)
        return f(*args, **kwargs)
    return decorated_function

def password_complexity(password):
    """Проверка сложности пароля"""
    if len(password) < 8:
        return False
    # Дополнительные проверки можно добавить здесь
    return True
