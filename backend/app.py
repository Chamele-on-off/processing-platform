from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, socketio
from config import Config
import routes

def create_app():
    app = Flask(__name__, static_folder='../frontend')
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    
    # Регистрация маршрутов
    app.register_blueprint(routes.auth.bp)
    app.register_blueprint(routes.admin.bp)
    app.register_blueprint(routes.trader.bp)
    app.register_blueprint(routes.merchant.bp)
    app.register_blueprint(routes.transactions.bp)
    app.register_blueprint(routes.requisites.bp)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        return send_from_directory(app.static_folder, 'index.html')
    
    return app

app = create_app()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
