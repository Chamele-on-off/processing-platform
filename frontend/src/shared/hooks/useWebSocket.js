import { useEffect, useState, useCallback } from 'react';
import { notification } from 'antd';
import api from '../utils/api';

export const useWebSocket = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);

  const connect = useCallback(() => {
    const socket = new WebSocket(`${api.defaults.baseURL.replace('http', 'ws')}${url}`);

    socket.onopen = () => {
      setIsConnected(true);
      if (options.onConnect) options.onConnect();
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setData(message);
        if (options.onMessage) options.onMessage(message);
      } catch (err) {
        setError(err);
      }
    };

    socket.onerror = (err) => {
      setError(err);
      if (options.onError) options.onError(err);
    };

    socket.onclose = () => {
      setIsConnected(false);
      if (options.onDisconnect) options.onDisconnect();
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [url, options]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      connect();
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message) => {
    if (ws && isConnected) {
      ws.send(JSON.stringify(message));
    } else {
      notification.warning({
        message: 'WebSocket не подключен',
        description: 'Невозможно отправить сообщение'
      });
    }
  }, [ws, isConnected]);

  return {
    data,
    isConnected,
    error,
    sendMessage,
    reconnect: connect
  };
};
