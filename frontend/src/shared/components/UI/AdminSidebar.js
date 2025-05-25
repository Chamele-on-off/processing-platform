import React from 'react';
import { Menu } from 'antd';
import { 
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const items = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <UserOutlined />, label: 'Users' },
    { key: '3', icon: <SettingOutlined />, label: 'Settings' },
    { key: '4', icon: <LogoutOutlined />, label: 'Logout', danger: true }
  ];

  return (
    <div className="admin-sidebar">
      <div className="logo">Admin Panel</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={items}
      />
    </div>
  );
};

export default AdminSidebar;
