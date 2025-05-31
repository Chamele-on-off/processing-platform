from app import create_app
from models import db, User
from extensions import bcrypt

app = create_app()

def init_db():
    with app.app_context():
        db.create_all()
        
        # Создаем тестового администратора
        if not User.query.filter_by(email='admin@example.com').first():
            admin = User(
                email='admin@example.com',
                role='admin',
                is_active=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
        
        # Создаем тестового трейдера
        if not User.query.filter_by(email='trader@example.com').first():
            trader = User(
                email='trader@example.com',
                role='trader',
                is_active=True,
                insurance_deposit=100000,
                priority=10
            )
            trader.set_password('trader123')
            db.session.add(trader)
        
        # Создаем тестового мерчанта
        if not User.query.filter_by(email='merchant@example.com').first():
            merchant = User(
                email='merchant@example.com',
                role='merchant',
                is_active=True,
                balance=50000
            )
            merchant.set_password('merchant123')
            db.session.add(merchant)
        
        db.session.commit()
        print("Test users created successfully")

if __name__ == '__main__':
    init_db()
