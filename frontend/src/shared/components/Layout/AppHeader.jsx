import React from 'react';
import { Layout, Menu, Space } from 'antd';
import { Link } from 'react-router-dom';
import { Logo } from '../UI/Icons';
import UserDropdown from './UserDropdown';
import './Header.css';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header className="app-header">
      <div className="logo-container">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <Space size="large">
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            { key: 'features', label: <Link to="/features">Возможности</Link> },
            { key: 'pricing', label: <Link to="/pricing">Тарифы</Link> },
            { key: 'contacts', label: <Link to="/contacts">Контакты</Link> }
          ]}
        />
        <UserDropdown />
      </Space>
    </Header>
  );
};

export default AppHeader;
