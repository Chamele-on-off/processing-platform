import os
from pdfminer.high_level import extract_text
from datetime import datetime
import re
from config import Config

def process_pdf_check(file):
    """Обработка PDF чека и извлечение данных"""
    # Сохраняем временный файл
    temp_path = os.path.join(Config.PDF_CHECK_FOLDER, 'temp.pdf')
    file.save(temp_path)
    
    # Извлекаем текст
    text = extract_text(temp_path)
    os.remove(temp_path)
    
    # Парсим данные (пример для Сбербанка)
    amount = re.search(r'Сумма:\s*(\d+\.?\d*)', text)
    date = re.search(r'Дата:\s*(\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2})', text)
    sender = re.search(r'Отправитель:\s*(.*)', text)
    
    if not amount or not date:
        raise ValueError("Invalid PDF check format")
    
    try:
        return {
            'amount': float(amount.group(1)),
            'date': datetime.strptime(date.group(1), '%d.%m.%Y %H:%M'),
            'sender': sender.group(1) if sender else 'Unknown',
            'text': text[:500]  # Первые 500 символов для логов
        }
    except Exception as e:
        raise ValueError(f"PDF parsing error: {str(e)}")
