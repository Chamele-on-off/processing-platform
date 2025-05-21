from fastapi import WebSocket
import json

class NotificationManager:
    def __init__(self):
        self.connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    async def send_personal(self, trader_id: int, message: str):
        for connection in self.connections:
            await connection.send_text(json.dumps({
                "trader_id": trader_id,
                "message": message
            }))
