import React from 'react';
import { Table, Tag, Space } from 'antd';
import { formatDateTime, formatCurrency } from '../../../../utils/formatters';

const TransactionTable = ({ transactions, limit }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => id.slice(-6)
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'deposit' ? 'green' : 'volcano'}>
          {type === 'deposit' ? 'Депозит' : 'Вывод'}
        </Tag>
      )
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatCurrency(amount)
    },
    {
      title: 'Мерчант',
      dataIndex: ['merchant', 'name'],
      key: 'merchant'
    },
    {
      title: 'Трейдер',
      dataIndex: ['trader', 'name'],
      key: 'trader'
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'completed': color = 'green'; break;
          case 'pending': color = 'orange'; break;
          case 'failed': color = 'red'; break;
          case 'disputed': color = 'purple'; break;
          default: color = 'blue';
        }
        return <Tag color={color}>{status}</Tag>;
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
    <Table
      columns={columns}
      dataSource={transactions?.slice(0, limit)}
      rowKey="_id"
      pagination={false}
      size="small"
    />
  );
};

export default TransactionTable;
