import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import './AuthForms.css';

const LoginForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      const { email, password, remember } = values;
      
      const user = await AuthService.login(email, password);
      
      if (remember) {
        AuthService.saveCredentials(email);
      }
      
      onSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Вход в аккаунт</h2>
      
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
        name="login"
        initialValues={{ remember: true }}
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
            prefix={<UserOutlined />} 
            placeholder="Email" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Пароль"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Запомнить меня</Checkbox>
          </Form.Item>
          <Link 
            to="/forgot-password" 
            className="auth-form-link"
            style={{ float: 'right' }}
          >
            Забыли пароль?
          </Link>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            block
          >
            Войти
          </Button>
        </Form.Item>
      </Form>

      <div className="auth-form-footer">
        Нет аккаунта? <Link to="/register" className="auth-form-link">Зарегистрироваться</Link>
      </div>
    </div>
  );
};

export default LoginForm;
