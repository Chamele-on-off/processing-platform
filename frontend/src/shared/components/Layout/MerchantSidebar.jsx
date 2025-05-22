import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  WalletOutlined,
  HistoryOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const MerchantSidebar = () => {
  const location = useLocation();
  
  const items = [
    {
      key: '/merchant/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/merchant/dashboard">Дашборд</Link>
    },
    {
      key: '/merchant/balance',
      icon: <WalletOutlined />,
      label: <Link to="/merchant/balance">Баланс</Link>
    },
    {
      key: '/merchant/history',
      icon: <HistoryOutlined />,
      label: <Link to="/merchant/history">История</Link>
    },
    {
      key: '/merchant/settings',
      icon: <SettingOutlined />,
      label: <Link to="/merchant/settings">Настройки</Link>
    }
  ];

  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={items}
      className="merchant-sidebar"
    />
  );
};

export default MerchantSidebar;
