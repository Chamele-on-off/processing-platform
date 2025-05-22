import React from 'react';
import { Card, Tag, Space, Divider, Typography } from 'antd';
import OrderActions from './OrderActions';
import { formatDateTime, formatAmount } from '../../../shared/utils/formatters';

const { Text, Title } = Typography;

const OrderItem = ({ order, traderId }) => {
  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: 'orange', text: 'Ожидание' },
      processing: { color: 'blue', text: 'В обработке' },
      completed: { color: 'green', text: 'Завершено' },
      disputed: { color: 'red', text: 'Спор' }
    };
    const statusInfo = statusMap[status] || { color: 'gray', text: 'Неизвестно' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  return (
    <Card className="order-item" hoverable>
      <div className="order-header">
        <Title level={5} className="order-id">Заявка #{order.id}</Title>
        <Space>
          {getStatusTag(order.status)}
          <Tag color={order.type === 'incoming' ? 'cyan' : 'purple'}>
            {order.type === 'incoming' ? 'Входящая' : 'Исходящая'}
          </Tag>
        </Space>
      </div>

      <Divider />

      <div className="order-details">
        <div>
          <Text strong>Сумма: </Text>
          <Text>{formatAmount(order.amount)} {order.currency}</Text>
        </div>
        <div>
          <Text strong>Метод: </Text>
          <Text>{order.paymentMethod}</Text>
        </div>
        <div>
          <Text strong>Создано: </Text>
          <Text>{formatDateTime(order.createdAt)}</Text>
        </div>
        {order.merchant && (
          <div>
            <Text strong>Мерчант: </Text>
            <Text>{order.merchant.name} (ID: {order.merchant.id})</Text>
          </div>
        )}
      </div>

      <Divider />

      <OrderActions 
        order={order} 
        traderId={traderId}
      />
    </Card>
  );
};

export default OrderItem;
