from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.transaction import Transaction
from services.transaction_service import TransactionService
from services.fraud_detection import FraudDetectionService
from utils.decorators import admin_required

bp = Blueprint('transactions', __name__, url_prefix='/transactions')

@bp.route('/<int:tx_id>', methods=['GET'])
@jwt_required()
def get_transaction(tx_id):
    transaction = Transaction.query.get_or_404(tx_id)
    return jsonify(transaction.to_dict())

@bp.route('/<int:tx_id>/pdf', methods=['POST'])
@jwt_required()
def upload_pdf(tx_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are allowed'}), 400
    
    try:
        transaction = TransactionService.upload_pdf_check(tx_id, file)
        return jsonify(transaction.to_dict())
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/fraud-check', methods=['POST'])
@jwt_required()
@admin_required
def fraud_check():
    data = request.get_json()
    result = FraudDetectionService.check_transaction(data)
    return jsonify({'is_fraud': result})
