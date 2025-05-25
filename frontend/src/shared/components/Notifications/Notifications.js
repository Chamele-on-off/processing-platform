import React, { useEffect, useState } from 'react';
import { notificationAPI } from '../../../utils/api';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationAPI.getNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className=\"notifications-container\">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={\`notification \${notification.type}\`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default Notifications
