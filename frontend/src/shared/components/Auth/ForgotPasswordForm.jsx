import React, { useState } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import './AuthForms.css';

const ForgotPasswordForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      await AuthService.forgotPassword(values.email);
      setSuccess(true);
      message.success('Инструкции отправлены на ваш email');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при восстановлении пароля');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-form-container">
        <h2 className="auth-form-title">Проверьте ваш email</h2>
        <Alert
          message="Инструкции по восстановлению пароля были отправлены на ваш email адрес."
          type="success"
          showIcon
        />
        <div className="auth-form-footer" style={{ marginTop: 24 }}>
          <Link to="/login" className="auth-form-link">Вернуться к входу</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Восстановление пароля</h2>
      <p className="auth-form-subtitle">
        Введите email, указанный при регистрации, и мы вышлем инструкции по восстановлению пароля
      </p>
      
      {error && (
        <Alert 
          message={error} 
          type="error" 
          showIcon 
          closable 
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        name="forgot-password"
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Пожалуйста, введите ваш email' },
            { type: 'email', message: 'Введите корректный email' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Email" 
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            block
          >
            Отправить инструкции
          </Button>
        </Form.Item>
      </Form>

      <div className="auth-form-footer">
        <Link to="/login" className="auth-form-link">Вернуться к входу</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
