from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.transaction import Transaction
from models.requisite import Requisite
from services.transaction_service import TransactionService
from utils.decorators import trader_required

bp = Blueprint('trader', __name__, url_prefix='/trader')

@bp.route('/dashboard', methods=['GET'])
@jwt_required()
@trader_required
def dashboard():
    user_id = get_jwt_identity()['id']
    user = User.query.get(user_id)
    
    pending_transactions = Transaction.query.filter_by(
        trader_id=user_id,
        status='pending'
    ).count()
    
    return jsonify({
        'balance': user.balance,
        'insurance_deposit': user.insurance_deposit,
        'pending_transactions': pending_transactions
    })

@bp.route('/transactions', methods=['GET'])
@jwt_required()
@trader_required
def get_transactions():
    user_id = get_jwt_identity()['id']
    transactions = TransactionService.get_user_transactions(user_id, 'trader')
    return jsonify([t.to_dict() for t in transactions])

@bp.route('/requisites', methods=['GET'])
@jwt_required()
@trader_required
def get_requisites():
    user_id = get_jwt_identity()['id']
    requisites = Requisite.query.filter_by(user_id=user_id).all()
    return jsonify([r.to_dict() for r in requisites])
