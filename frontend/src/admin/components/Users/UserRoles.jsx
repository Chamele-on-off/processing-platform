import React, { useState } from 'react';
import { Modal, Form, Select, Button, message, Tag } from 'antd';
import api from '../../../../services/adminApi';

const { Option } = Select;

const UserRoles = ({ user, onUpdate }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const roleColors = {
    admin: 'purple',
    trader: 'blue',
    merchant: 'green'
  };

  const roleNames = {
    admin: 'Админ',
    trader: 'Трейдер',
    merchant: 'Мерчант'
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await api.updateUser(user._id, { role: values.role });
      message.success('Роль пользователя обновлена');
      onUpdate();
      setVisible(false);
    } catch (error) {
      message.error('Ошибка при обновлении роли');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tag 
        color={roleColors[user.role]} 
        style={{ cursor: 'pointer' }}
        onClick={() => {
          form.setFieldsValue({ role: user.role });
          setVisible(true);
        }}
      >
        {roleNames[user.role]}
      </Tag>

      <Modal
        title="Изменение роли пользователя"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            Отмена
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading} 
            onClick={handleSubmit}
          >
            Сохранить
          </Button>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="role"
            label="Роль"
            rules={[{ required: true, message: 'Выберите роль' }]}
          >
            <Select>
              <Option value="admin">Администратор</Option>
              <Option value="trader">Трейдер</Option>
              <Option value="merchant">Мерчант</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserRoles;
