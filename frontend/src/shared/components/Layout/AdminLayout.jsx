import React from 'react';
import { Layout } from 'antd';
import AdminSidebar from '../UI/AdminSidebar';
import AdminHeader from '../UI/AdminHeader';
import './Layout.css';

const { Content, Sider } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout className="admin-layout">
      <Sider
        width={250}
        theme="dark"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <AdminSidebar />
      </Sider>
      <Layout>
        <AdminHeader />
        <Content className="admin-content">
          <div className="admin-container">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
