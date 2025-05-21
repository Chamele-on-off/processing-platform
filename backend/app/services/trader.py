async def update_trader_status(trader_id: int, direction: str, is_active: bool):
    """Обновление статуса приема заявок"""
    trader = await Trader.get(id=trader_id)
    if direction == "in":
        trader.accept_incoming = is_active
    else:
        trader.accept_outgoing = is_active
    await trader.save()

async def validate_and_save_receipt(file: UploadFile, transaction_id: UUID):
    """Валидация PDF-чека"""
    content = await file.read()
    if not pdf_checker.validate(content):
        raise HTTPException(400, "Неверный чек")
    await save_to_db(transaction_id, content)
