import React, { useEffect } from 'react';
import { notification } from 'antd';
import { useWebNotifications } from './useWebNotifications';
import './Notifications.css';

const ToastNotifier = () => {
  const { notifications } = useWebNotifications();

  useEffect(() => {
    notifications.forEach(({ id, type, title, message }) => {
      notification[type]({
        key: id,
        message: title,
        description: message,
        duration: 5,
      });
    });
  }, [notifications]);

  return null;
};

export default ToastNotifier;
