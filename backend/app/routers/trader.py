from fastapi import APIRouter, UploadFile, Depends
from app.services.trader import *
from app.models.trader import Trader

router = APIRouter(prefix="/api/trader")

@router.post("/toggle-requests")
async def toggle_requests(
    direction: str,  # "in" или "out"
    is_active: bool,
    trader: Trader = Depends(get_current_trader)
):
    """Включение/выключение заявок"""
    await update_trader_status(trader.id, direction, is_active)
    return {"status": "success"}

@router.post("/upload-receipt")
async def upload_receipt(
    file: UploadFile,
    transaction_id: UUID,
    trader: Trader = Depends(get_current_trader)
):
    """Загрузка PDF-чека"""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Только PDF!")
    
    await validate_and_save_receipt(file, transaction_id)
    return {"status": "ok"}

@router.get("/disputes")
async def get_disputes(trader: Trader = Depends(get_current_trader)):
    return await Dispute.filter(trader_id=trader.id).all()

@router.post("/disputes")
async def create_dispute(
    dispute: DisputeCreate,
    trader: Trader = Depends(get_current_trader)
):
    tx = await Transaction.get(id=dispute.transaction_id)
    if tx.trader_id != trader.id:
        raise HTTPException(403, "Not your transaction")
    
    await Dispute.create(
        transaction_id=tx.id,
        reason=dispute.reason
    )
    await notify_admin(f"Новый диспут по транзакции {tx.id}")
    return {"status": "ok"}
