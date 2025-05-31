from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.decorators import admin_required
from models.user import User
from models.transaction import Transaction
from services.fraud_detection import FraudDetection

bp = Blueprint('admin', __name__, url_prefix='/admin')

@bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_stats():
    stats = {
        'total_users': User.get_count(),
        'today_transactions': Transaction.get_today_count(),
        'active_traders': User.get_active_traders_count(),
        'avg_processing_time': Transaction.get_avg_processing_time(),
        'fraud_alerts': FraudDetection.get_active_alerts_count()
    }
    return jsonify(stats)

@bp.route('/transactions', methods=['GET'])
@jwt_required()
@admin_required
def get_transactions():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    transactions = Transaction.query.paginate(page, per_page)
    return jsonify([t.to_dict() for t in transactions.items])

@bp.route('/resolve-dispute/<int:dispute_id>', methods=['POST'])
@jwt_required()
@admin_required
def resolve_dispute(dispute_id):
    # Логика разрешения диспута
    return jsonify({'status': 'success'})
