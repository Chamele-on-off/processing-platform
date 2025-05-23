import React, { useState, useEffect } from 'react';
import { Badge, List, Popover, Button, Tabs } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import api from '../../../utils/api';
import './Notifications.css';

const { TabPane } = Tabs;

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const content = (
    <div className="notification-popover">
      <Tabs defaultActiveKey="1">
        <TabPane tab={`Все (${notifications.length})`} key="1">
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            loading={loading}
            renderItem={(item) => (
              <List.Item
                className={`notification-item ${item.unread ? 'unread' : ''}`}
                onClick={() => markAsRead(item.id)}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.message}
                />
                <div className="notification-time">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </div>
              </List.Item>
            )}
          />
          <div className="notification-actions">
            <Button type="link" onClick={markAllAsRead}>
              Пометить все как прочитанные
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );

  return (
    <Popover 
      content={content} 
      title="Уведомления" 
      trigger="click"
      placement="bottomRight"
    >
      <Badge count={unreadCount} className="notification-badge">
        <BellOutlined className="notification-icon" />
      </Badge>
    </Popover>
  );
};

export default NotificationCenter;
