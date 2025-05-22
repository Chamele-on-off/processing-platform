import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import api from '../../../../services/adminApi';

const { Option } = Select;

const UserEditModal = ({ visible, onCancel, user, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    }
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await api.updateUser(user._id, values);
      message.success('Пользователь успешно обновлен');
      onSuccess();
      onCancel();
    } catch (error) {
      message.error('Ошибка при обновлении пользователя');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Редактирование пользователя"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Сохранить
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Пожалуйста, введите email' },
            { type: 'email', message: 'Пожалуйста, введите корректный email' }
          ]}
        >
          <Input disabled />
        </Form.Item>
        
        <Form.Item
          name="role"
          label="Роль"
          rules={[{ required: true, message: 'Пожалуйста, выберите роль' }]}
        >
          <Select>
            <Option value="admin">Админ</Option>
            <Option value="trader">Трейдер</Option>
            <Option value="merchant">Мерчант</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="status"
          label="Статус"
          rules={[{ required: true, message: 'Пожалуйста, выберите статус' }]}
        >
          <Select>
            <Option value="active">Активен</Option>
            <Option value="suspended">Приостановлен</Option>
            <Option value="banned">Заблокирован</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;
