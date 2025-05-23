import React from 'react';
import { Alert } from 'antd';
import './Notifications.css';

const AlertBanner = ({ message, type = 'info', closable = true }) => {
  if (!message) return null;

  return (
    <div className="alert-banner">
      <Alert 
        message={message}
        type={type}
        closable={closable}
        showIcon
        banner
      />
    </div>
  );
};

export default AlertBanner;
