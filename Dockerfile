FROM python:3.9

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend /app
COPY frontend /app/static  # Копируем фронтенд в static

CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]
