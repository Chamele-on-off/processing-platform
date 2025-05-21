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
