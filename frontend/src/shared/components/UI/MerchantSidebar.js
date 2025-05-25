import React from 'react';
import { Menu } from 'antd';
import {
  ShopOutlined,
  DollarOutlined,
  ProfileOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import './MerchantSidebar.css';
import { useNavigate } from 'react-router-dom';

const MerchantSidebar = () => {
  const navigate = useNavigate();
  
  const items = [
    { 
      key: 'dashboard',
      icon: <ShopOutlined />,
      label: 'Мой магазин',
      onClick: () => navigate('/merchant/dashboard')
    },
    {
      key: 'products',
      icon: <ProfileOutlined />,
      label: 'Товары',
      onClick: () => navigate('/merchant/products')
    },
    {
      key: 'transactions',
      icon: <DollarOutlined />,
      label: 'Транзакции',
      onClick: () => navigate('/merchant/transactions')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Настройки',
      onClick: () => navigate('/merchant/settings')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выход',
      danger: true,
      onClick: () => {
        localStorage.removeItem('merchantToken');
        navigate('/login');
      }
    }
  ];

  return (
    <div className="merchant-sidebar">
      <div className="sidebar-header">
        <h3>Панель продавца</h3>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        items={items}
      />
    </div>
  );
};

export default MerchantSidebar;
