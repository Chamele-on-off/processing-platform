import React from 'react';
import { Layout, Row, Col, Divider } from 'antd';
import { 
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined 
} from '@ant-design/icons';
import './Footer.css';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="app-footer">
      <Row gutter={[32, 32]}>
        <Col xs={24} md={8}>
          <div className="footer-section">
            <h3 className="footer-title">Processing Platform</h3>
            <p className="footer-text">
              Профессиональное решение для обработки платежей и управления транзакциями.
            </p>
          </div>
        </Col>
        
        <Col xs={24} md={8}>
          <div className="footer-section">
            <h3 className="footer-title">Контакты</h3>
            <p className="footer-text">support@processing.com</p>
            <p className="footer-text">+7 (123) 456-78-90</p>
          </div>
        </Col>
        
        <Col xs={24} md={8}>
          <div className="footer-section">
            <h3 className="footer-title">Соцсети</h3>
            <Space size="large">
              <a href="#"><GithubOutlined className="social-icon" /></a>
              <a href="#"><TwitterOutlined className="social-icon" /></a>
              <a href="#"><LinkedinOutlined className="social-icon" /></a>
            </Space>
          </div>
        </Col>
      </Row>
      
      <Divider className="footer-divider" />
      
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Processing Platform. Все права защищены.</span>
        <div>
          <a href="#" className="footer-link">Политика конфиденциальности</a>
          <a href="#" className="footer-link">Условия использования</a>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
