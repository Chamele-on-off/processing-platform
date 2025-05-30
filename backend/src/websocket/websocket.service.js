import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import NotificationService from '../services/notification.service.js';

class WebSocketService {
  static init(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();

    this.wss.on('connection', (ws, req) => {
      const token = req.url.split('token=')[1];
      
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const userId = decoded.id;
        const role = decoded.role;

        this.clients.set(userId, { ws, role });

        ws.on('message', (message) => {
          this.handleMessage(userId, message);
        });

        ws.on('close', () => {
          this.clients.delete(userId);
        });

        // Отправить непрочитанные уведомления
        NotificationService.getUnread(userId).then(notifications => {
          notifications.forEach(notification => {
            this.sendToUser(userId, 'notification', notification);
          });
        });

      } catch (e) {
        ws.close(1008, 'Unauthorized');
      }
    });
  }

  static broadcast(role, type, data) {
    this.clients.forEach((client, userId) => {
      if (client.role === role) {
        this.sendToUser(userId, type, data);
      }
    });
  }

  static sendToUser(userId, type, data) {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({ type, data }));
    }
  }

  static handleMessage(userId, message) {
    try {
      const { type, data } = JSON.parse(message);
      
      switch (type) {
        case 'mark_as_read':
          NotificationService.markAsRead(data.notificationId, userId);
          break;
        // Другие типы сообщений
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  }
}

export default WebSocketService;
