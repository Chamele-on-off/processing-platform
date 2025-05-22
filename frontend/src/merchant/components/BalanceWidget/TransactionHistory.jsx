import React from 'react';
import { Table, Tag, Space } from 'antd';
import { 
  ArrowDownOutlined, 
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';
import { formatDateTime, formatAmount } from '../../../shared/utils/formatters';
import './BalanceWidget.css';

const TransactionHistory = ({ transactions, loading }) => {
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
          completed: { icon: <CheckCircleOutlined />, color: 'green', text: 'Завершено' },
          pending: { icon: <ClockCircleOutlined />, color: 'orange', text: 'В обработке' },
          failed: { icon: <CloseCircleOutlined />, color: 'red', text: 'Ошибка' }
        };
        const statusInfo = statusMap[status] || { icon: null, color: 'gray', text: status };
        return (
          <Tag icon={statusInfo.icon} color={statusInfo.color}>
            {statusInfo.text}
          </Tag>
        );
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
    <Card className="transaction-history" title="История операций">
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        size="middle"
      />
    </Card>
  );
};

export default TransactionHistory;
