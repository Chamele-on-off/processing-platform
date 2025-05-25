import React from 'react';
import './Notifications.css';

const Notifications = ({ notifications }) => {
  return (
    <div className="notifications-container">
      {notifications.map((notification, index) => (
        <div 
          key={index} 
          className={`notification ${notification.type}`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
