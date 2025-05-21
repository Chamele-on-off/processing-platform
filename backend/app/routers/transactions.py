from fastapi import APIRouter
from app.models.transactions import Transaction

router = APIRouter()


@router.post("/transactions/", response_model=Transaction)
async def create_transaction(transaction: Transaction):
    return transaction