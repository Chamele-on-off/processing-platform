import React from 'react';
import { Layout, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import './Layout.css';

const { Content } = Layout;

const AuthLayout = ({ children }) => {
  return (
    <Layout className="auth-layout">
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={22} sm={18} md={12} lg={8}>
            <div className="auth-container">
              <div className="auth-header">
                <Link to="/">
                  <img 
                    src="/logo.svg" 
                    alt="Логотип" 
                    className="auth-logo"
                  />
                </Link>
                <h2 className="auth-title">Добро пожаловать</h2>
              </div>
              <div className="auth-content">
                {children}
              </div>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
