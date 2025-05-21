from fastapi import APIRouter
from app.models.transactions import Transaction

router = APIRouter()

@router.post("/transactions/")
async def create_transaction(transaction: Transaction):
    return {"status": "OK"}
