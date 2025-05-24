import { WS_URL } from '../utils/constants';
import { message } from 'antd';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
  }

  connect = (token) => {
    if (this.socket) return;

    this.socket = new WebSocket(`${WS_URL}?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data.type, data.payload);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => this.connect(token), 5000);
    };
  };

  subscribe = (eventType, callback) => {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push(callback);
    return () => this.unsubscribe(eventType, callback);
  };

  unsubscribe = (eventType, callback) => {
    const subscribers = this.subscribers.get(eventType) || [];
    this.subscribers.set(
      eventType,
      subscribers.filter(cb => cb !== callback)
    );
  };

  notifySubscribers = (eventType, payload) => {
    const subscribers = this.subscribers.get(eventType) || [];
    subscribers.forEach(callback => callback(payload));
  };

  send = (type, payload) => {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      message.warning('Соединение не установлено');
    }
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  };
}

export default new WebSocketService();
