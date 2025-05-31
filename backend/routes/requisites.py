from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.requisite import Requisite
from extensions import db
from utils.decorators import trader_required

bp = Blueprint('requisites', __name__, url_prefix='/requisites')

@bp.route('/', methods=['POST'])
@jwt_required()
@trader_required
def create_requisite():
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    
    requisite = Requisite(
        user_id=user_id,
        type=data['type'],
        details=data['details'],
        max_amount=data.get('max_amount'),
        min_amount=data.get('min_amount', 0),
        currency=data.get('currency', 'RUB')
    )
    
    db.session.add(requisite)
    db.session.commit()
    
    return jsonify(requisite.to_dict()), 201

@bp.route('/<int:req_id>', methods=['DELETE'])
@jwt_required()
@trader_required
def delete_requisite(req_id):
    user_id = get_jwt_identity()['id']
    requisite = Requisite.query.filter_by(id=req_id, user_id=user_id).first_or_404()
    
    db.session.delete(requisite)
    db.session.commit()
    
    return jsonify({'message': 'Requisite deleted'})
