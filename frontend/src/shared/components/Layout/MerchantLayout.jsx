import React from 'react';
import { Layout } from 'antd';
import MerchantSidebar from '../UI/MerchantSidebar';
import MerchantHeader from '../UI/MerchantHeader';
import './Layout.css';

const { Content, Sider } = Layout;

const MerchantLayout = ({ children }) => {
  return (
    <Layout className="merchant-layout">
      <Sider
        width={220}
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <MerchantSidebar />
      </Sider>
      <Layout>
        <MerchantHeader />
        <Content className="merchant-content">
          <div className="merchant-container">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MerchantLayout;
