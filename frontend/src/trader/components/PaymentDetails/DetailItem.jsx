import React from 'react';
import { Card, Tag, Space, Typography, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatPaymentType, formatPaymentSystem } from '../../../shared/utils/formatters';

const { Text, Paragraph } = Typography;

const DetailItem = ({ item, onEdit, onDelete }) => {
  const getStatusTag = () => {
    return item.isActive ? (
      <Tag color="green">Активен</Tag>
    ) : (
      <Tag color="orange">Неактивен</Tag>
    );
  };

  return (
    <Card 
      className="payment-detail-item" 
      hoverable
      actions={[
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(item)}
        >
          Редактировать
        </Button>,
        <Popconfirm
          title="Удалить этот реквизит?"
          onConfirm={() => onDelete(item.id)}
          okText="Да"
          cancelText="Нет"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            Удалить
          </Button>
        </Popconfirm>
      ]}
    >
      <div className="detail-header">
        <Space>
          <Text strong>{formatPaymentSystem(item.paymentSystem)}</Text>
          {getStatusTag()}
          <Tag>{formatPaymentType(item.type)}</Tag>
        </Space>
      </div>

      <Paragraph className="detail-content">
        <pre>{item.details}</pre>
      </Paragraph>

      <div className="detail-footer">
        {item.maxAmount && (
          <Text type="secondary">
            Макс. сумма: {item.maxAmount} ₽
          </Text>
        )}
        {item.comment && (
          <Text type="secondary" italic>
            {item.comment}
          </Text>
        )}
      </div>
    </Card>
  );
};

export default DetailItem;
