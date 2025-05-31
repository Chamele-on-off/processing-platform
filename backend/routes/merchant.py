from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.transaction import Transaction
from services.transaction_service import TransactionService
from utils.decorators import merchant_required

bp = Blueprint('merchant', __name__, url_prefix='/merchant')

@bp.route('/deposit', methods=['POST'])
@jwt_required()
@merchant_required
def create_deposit():
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    
    transaction = TransactionService.create_transaction({
        **data,
        'type': 'deposit',
        'merchant_id': user_id
    })
    
    return jsonify(transaction.to_dict()), 201

@bp.route('/transactions', methods=['GET'])
@jwt_required()
@merchant_required
def get_transactions():
    user_id = get_jwt_identity()['id']
    transactions = TransactionService.get_user_transactions(user_id, 'merchant')
    return jsonify([t.to_dict() for t in transactions])
