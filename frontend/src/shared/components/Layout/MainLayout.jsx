import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../UI/AppHeader';
import AppFooter from '../UI/AppFooter';
import './Layout.css';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout className="main-layout">
      <AppHeader />
      <Content className="main-content">
        {children}
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
