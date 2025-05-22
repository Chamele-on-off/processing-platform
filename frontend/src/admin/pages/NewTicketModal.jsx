import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import api from '../../../../services/adminApi';

const { TextArea } = Input;
const { Option } = Select;

const NewTicketModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await api.createTicket(values);
      onSuccess();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Создание нового тикета"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={handleSubmit}
        >
          Создать
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="subject"
          label="Тема"
          rules={[{ required: true, message: 'Введите тему тикета' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="type"
          label="Тип"
          rules={[{ required: true, message: 'Выберите тип тикета' }]}
        >
          <Select>
            <Option value="technical">Технический</Option>
            <Option value="financial">Финансовый</Option>
            <Option value="dispute">Спор</Option>
            <Option value="other">Другой</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="priority"
          label="Приоритет"
          initialValue={3}
        >
          <Select>
            <Option value={1}>Низкий</Option>
            <Option value={2}>Пониженный</Option>
            <Option value={3}>Средний</Option>
            <Option value={4}>Высокий</Option>
            <Option value={5}>Критичный</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="message"
          label="Сообщение"
          rules={[{ required: true, message: 'Введите сообщение' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewTicketModal;
