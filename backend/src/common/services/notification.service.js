const WebSocket = require('ws');
const logger = require('../utils/logger');
const User = require('../models/user.model');

class NotificationService {
  constructor() {
    this.clients = new Map();
    this.server = null;
  }

  init(httpServer) {
    this.server = new WebSocket.Server({ server: httpServer });

    this.server.on('connection', (ws, req) => {
      const userId = req.headers['user-id'];
      if (!userId) {
        return ws.close(4001, 'User ID required');
      }

      this.clients.set(userId, ws);
      logger.info(`New WS connection for user ${userId}`);

      ws.on('close', () => {
        this.clients.delete(userId);
        logger.info(`WS connection closed for user ${userId}`);
      });
    });
  }

  notifyUser(userId, message) {
    try {
      const ws = this.clients.get(userId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Notification failed for user ${userId}:`, error);
      return false;
    }
  }

  async notifyAdmins(message) {
    try {
      const admins = await User.find({ role: 'admin' });
      admins.forEach(admin => {
        this.notifyUser(admin._id.toString(), message);
      });
    } catch (error) {
      logger.error('Admin notification failed:', error);
    }
  }
}

module.exports = new NotificationService();
