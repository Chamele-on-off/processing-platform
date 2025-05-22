import React, { useState } from 'react';
import { Modal, Comment, List, Avatar, Form, Input, Button, Select, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { formatDateTime } from '../../../../utils/formatters';
import api from '../../../../services/adminApi';

const { TextArea } = Input;
const { Option } = Select;

const TicketDetail = ({ ticket, onClose, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const [messages, setMessages] = useState(ticket.messages);

  const handleAddMessage = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const response = await api.addTicketMessage(ticket._id, values.message);
      setMessages(response.data.messages);
      form.resetFields();
      onUpdate();
    } catch (error) {
      console.error('Failed to add message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await api.updateTicketStatus(ticket._id, { status: newStatus });
      setStatus(newStatus);
      onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Тикет #${ticket._id.slice(-6)}`}
      visible={true}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="ticket-header">
        <h3>{ticket.subject}</h3>
        <div className="ticket-meta">
          <Tag color={
            status === 'open' ? 'blue' : 
            status === 'in_progress' ? 'orange' : 
            status === 'resolved' ? 'green' : 'gray'
          }>
            {status === 'open' ? 'Открыт' : 
             status === 'in_progress' ? 'В работе' : 
             status === 'resolved' ? 'Решен' : 'Закрыт'}
          </Tag>
          
          <Select
            value={status}
            onChange={handleStatusChange}
            style={{ width: 150, marginLeft: 10 }}
            disabled={loading}
          >
            <Option value="open">Открыт</Option>
            <Option value="in_progress">В работе</Option>
            <Option value="resolved">Решен</Option>
            <Option value="closed">Закрыт</Option>
          </Select>
        </div>
      </div>
      
      <List
        className="ticket-messages"
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={message => (
          <Comment
            author={message.isAdmin ? 'Администратор' : 'Пользователь'}
            avatar={<Avatar icon={<UserOutlined />} />}
            content={message.text}
            datetime={formatDateTime(message.createdAt)}
          />
        )}
      />
      
      <Form form={form} layout="vertical">
        <Form.Item
          name="message"
          label="Новое сообщение"
          rules={[{ required: true, message: 'Введите текст сообщения' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            onClick={handleAddMessage}
            loading={loading}
          >
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TicketDetail;
