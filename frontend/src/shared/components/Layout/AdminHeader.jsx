import React from 'react';
import { Layout, Dropdown, Avatar, Badge } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './Header.css';

const { Header } = Layout;

const AdminHeader = () => {
  const items = [
    {
      key: 'profile',
      label: 'Профиль',
      icon: <UserOutlined />
    },
    {
      key: 'logout',
      label: 'Выйти',
      icon: <LogoutOutlined />
    }
  ];

  return (
    <Header className="admin-header">
      <div className="header-right">
        <Badge count={5} className="notification-badge">
          <BellOutlined style={{ fontSize: 18 }} />
        </Badge>
        <Dropdown menu={{ items }} placement="bottomRight">
          <div className="admin-user">
            <Avatar 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#1890ff' }}
            />
            <span className="admin-name">Администратор</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;
