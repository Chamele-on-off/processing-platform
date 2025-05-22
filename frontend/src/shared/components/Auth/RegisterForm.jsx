import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
  PhoneOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import './AuthForms.css';

const RegisterForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await AuthService.register(values);
      onSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Создать аккаунт</h2>
      
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
        name="register"
        onFinish={handleSubmit}
        layout="vertical"
        scrollToFirstError
      >
        <Form.Item
          name="name"
          rules={[
            { required: true, message: 'Пожалуйста, введите ваше имя' },
            { min: 2, message: 'Имя слишком короткое' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Имя" 
            size="large"
          />
        </Form.Item>

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

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: 'Пожалуйста, введите ваш телефон' },
            { pattern: /^[\d\+][\d\s\-\(\)]{9,}$/, message: 'Введите корректный телефон' }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="Телефон" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Пожалуйста, введите пароль' },
            { min: 6, message: 'Пароль должен быть не менее 6 символов' }
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Пароль"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Пожалуйста, подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Подтвердите пароль"
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
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>

      <div className="auth-form-footer">
        Уже есть аккаунт? <Link to="/login" className="auth-form-link">Войти</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
