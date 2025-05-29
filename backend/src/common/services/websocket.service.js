const WebSocket = require('ws');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const config = require('../config');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (ws, req) => {
      this.authenticate(ws, req)
        .then(userId => {
          if (!userId) {
            return ws.close(4001, 'Authentication failed');
          }

          this.clients.set(userId, ws);
          logger.info(`New WS connection for user ${userId}`);

          ws.on('message', message => this.handleMessage(userId, message));
          ws.on('close', () => this.handleClose(userId));
          ws.on('error', error => this.handleError(userId, error));

          // Send initial connection confirmation
          ws.send(JSON.stringify({
            type: 'connection',
            status: 'success',
            userId
          }));
        })
        .catch(error => {
          logger.error('WS authentication error:', error);
          ws.close(4002, 'Authentication error');
        });
    });
  }

  async authenticate(ws, req) {
    const token = req.headers['sec-websocket-protocol'];
    if (!token) {
      return null;
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      return decoded.id;
    } catch (error) {
      logger.error('WS token verification failed:', error);
      return null;
    }
  }

  handleMessage(userId, message) {
    try {
      const data = JSON.parse(message);
      logger.debug(`WS message from ${userId}:`, data);
      // Here you can add message handling logic
    } catch (error) {
      logger.error(`WS message processing failed for ${userId}:`, error);
    }
  }

  handleClose(userId) {
    this.clients.delete(userId);
    logger.info(`WS connection closed for user ${userId}`);
  }

  handleError(userId, error) {
    logger.error(`WS error for user ${userId}:`, error);
    this.clients.delete(userId);
  }

  sendToUser(userId, message) {
    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  broadcast(message) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

module.exports = new WebSocketService();
