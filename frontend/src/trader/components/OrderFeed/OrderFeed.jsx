import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Empty } from 'antd';
import OrderItem from './OrderItem';
import OrderFilters from './OrderFilters';
import useWebSocket from '../../../shared/hooks/useWebSocket';
import traderApi from '../../services/traderApi';
import './OrderFeed.css';

const OrderFeed = ({ traderId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'incoming',
    status: 'pending',
    minAmount: null,
    maxAmount: null,
    paymentMethod: 'all'
  });

  const { lastMessage } = useWebSocket('/topic/orders');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await traderApi.getOrders(filters);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

  useEffect(() => {
    if (lastMessage) {
      const newOrder = JSON.parse(lastMessage.data);
      setOrders(prev => [newOrder, ...prev]);
    }
  }, [lastMessage]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <Card title="Лента заявок" bordered={false}>
      <OrderFilters onFilterChange={handleFilterChange} />
      
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : orders.length === 0 ? (
        <Empty description="Нет доступных заявок" />
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <OrderItem 
              key={order.id} 
              order={order} 
              traderId={traderId}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default OrderFeed;
