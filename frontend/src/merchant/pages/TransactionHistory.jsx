import React, { useState, useEffect } from 'react';
import { Table, Tag, DatePicker, Select, Button, Space } from 'antd';
import { 
  ArrowDownOutlined, 
  ArrowUpOutlined,
  FilterOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import merchantApi from '../services/merchantApi';
import { formatDateTime, formatAmount } from '../../../shared/utils/formatters';
import './TransactionHistory.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionHistory = ({ merchantId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: [],
    type: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchTransactions();
  }, [merchantId, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await merchantApi.getTransactions(merchantId, filters);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id.slice(0, 8)}`
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag icon={type === 'deposit' ? <ArrowDownOutlined /> : <ArrowUpOutlined />} 
          color={type === 'deposit' ? 'green' : 'red'}>
          {type === 'deposit' ? 'Депозит' : 'Вывод'}
        </Tag>
      )
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatAmount(amount) + ' ₽'
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          completed: { color: 'green', text: 'Завершено' },
          pending: { color: 'orange', text: 'В обработке' },
          failed: { color: 'red', text: 'Ошибка' }
        };
        const statusInfo = statusMap[status] || { color: 'gray', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDateTime(date)
    }
  ];

  return (
    <div className="transaction-history-page">
      <div className="filters">
        <Space size="middle">
          <RangePicker 
            onChange={(dates) => handleFilterChange('dateRange', dates)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Тип операции"
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange('type', value)}
          >
            <Option value="all">Все</Option>
            <Option value="deposit">Депозиты</Option>
            <Option value="withdraw">Выводы</Option>
          </Select>
          <Select
            placeholder="Статус"
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange('status', value)}
          >
            <Option value="all">Все</Option>
            <Option value="completed">Завершено</Option>
            <Option value="pending">В обработке</Option>
            <Option value="failed">Ошибка</Option>
          </Select>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchTransactions}
          >
            Обновить
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default TransactionHistory;
