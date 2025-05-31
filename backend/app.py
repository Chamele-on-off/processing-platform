import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from extensions import db, jwt, socketio
from config import Config
from routes import auth_bp, admin_bp, trader_bp, merchant_bp, transactions_bp, requisites_bp
from utils.currency_rates import get_currency_rate
from services.fraud_detection import FraudDetectionService

def create_app():
    app = Flask(__name__, static_folder='../frontend')
    app.config.from_object(Config)
    
    # Инициализация расширений
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    
    # Регистрация blueprint
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')
    app.register_blueprint(trader_bp, url_prefix='/api/v1/trader')
    app.register_blueprint(merchant_bp, url_prefix='/api/v1/merchant')
    app.register_blueprint(transactions_bp, url_prefix='/api/v1/transactions')
    app.register_blueprint(requisites_bp, url_prefix='/api/v1/requisites')
    
    # Создание папки для чеков
    if not os.path.exists(Config.PDF_CHECK_FOLDER):
        os.makedirs(Config.PDF_CHECK_FOLDER)
    
    # Запуск фоновых задач
    if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        with app.app_context():
            # Предзагрузка курсов валют
            get_currency_rate()
            # Запуск мониторинга активности
            FraudDetectionService.start_monitoring()
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    
    return app

app = create_app()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
