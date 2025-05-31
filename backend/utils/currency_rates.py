import requests
from functools import lru_cache
from datetime import datetime, timedelta
from config import Config

@lru_cache(maxsize=1)
def get_currency_rate(base='RUB', target='USD'):
    """Получение курса валют с кэшированием"""
    try:
        response = requests.get(
            f"https://api.exchangerate-api.com/v4/latest/{base}",
            params={'access_key': Config.EXCHANGE_RATE_API_KEY}
        )
        data = response.json()
        return data['rates'].get(target, 1.0)
    except:
        # Fallback rate
        return 75.0 if target == 'USD' else 1.0

def convert_amount(amount, from_currency, to_currency):
    """Конвертация суммы между валютами"""
    if from_currency == to_currency:
        return amount
    rate = get_currency_rate(from_currency, to_currency)
    return amount * rate
