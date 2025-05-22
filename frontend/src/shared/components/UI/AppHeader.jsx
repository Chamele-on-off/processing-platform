import React from 'react';
import { Layout, Menu, Space, Avatar, Dropdown, Badge } from 'antd';
import { 
  BellOutlined, 
  UserOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './Header.css';

const { Header } = Layout;

const AppHeader = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const userMenu = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: onLogout
    }
  ];

  const mainMenuItems = [
    { key: 'dashboard', label: <Link to="/">Главная</Link> },
    { key: 'transactions', label: <Link to="/transactions">Транзакции</Link> },
    { key: 'reports', label: <Link to="/reports">Отчеты</Link> }
  ];

  return (
    <Header className="app-header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <Logo />
        </Link>
        
        <Menu
          theme="dark"
          mode="horizontal"
          items={mainMenuItems}
          className="main-menu"
        />
      </div>

      <div className="header-right">
        <Badge count={5} className="notification-badge">
          <BellOutlined 
            onClick={() => navigate('/notifications')}
            className="notification-icon"
          />
        </Badge>

        <Dropdown menu={{ items: userMenu }} trigger={['click']}>
          <div className="user-profile">
            <Avatar 
              icon={<UserOutlined />} 
              src={user?.avatar}
              className="user-avatar"
            />
            <span className="user-name">{user?.name || 'Пользователь'}</span>
            <DownOutlined className="user-dropdown-icon" />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
