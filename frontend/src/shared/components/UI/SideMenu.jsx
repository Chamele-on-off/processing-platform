import React from 'react';
import { Menu } from 'antd';
import { 
  DashboardOutlined,
  TransactionOutlined,
  WalletOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Дашборд</Link>
    },
    {
      key: '/transactions',
      icon: <TransactionOutlined />,
      label: <Link to="/transactions">Транзакции</Link>
    },
    {
      key: '/wallets',
      icon: <WalletOutlined />,
      label: <Link to="/wallets">Кошельки</Link>
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: <Link to="/reports">Отчеты</Link>
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link to="/users">Пользователи</Link>
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Настройки</Link>
    }
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      className="side-menu"
      inlineCollapsed={collapsed}
    />
  );
};

export default SideMenu;
