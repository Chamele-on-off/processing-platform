import React from 'react';
import { Layout, Dropdown, Avatar, Badge } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import './AdminHeader.css';

const { Header } = Layout;

const AdminHeader = ({ user }) => {
  const items = [
    {
      key: '1',
      label: 'Профиль',
      icon: <UserOutlined />
    },
    {
      key: '2',
      label: 'Настройки',
      icon: <SettingOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: '3',
      label: 'Выйти',
      icon: <LogoutOutlined />,
      danger: true
    }
  ];

  return (
    <Header className="admin-header">
      <div className="header-content">
        <div className="header-actions">
          <Badge count={5} className="notification-badge">
            <BellOutlined style={{ fontSize: '18px' }} />
          </Badge>
          
          <Dropdown menu={{ items }} placement="bottomRight">
            <div className="user-dropdown">
              <Avatar 
                size="default" 
                icon={<UserOutlined />} 
                src={user?.avatar}
              />
              <span className="user-name">{user?.name || 'Администратор'}</span>
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default AdminHeader;
