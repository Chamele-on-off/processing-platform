import React from 'react';
import { Table, Tag, Button } from 'antd';
import { formatDateTime } from '../../../../utils/formatters';

const DisputedTransactions = ({ transactions, loading }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: id => id.slice(-6)
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: 'Причина спора',
      dataIndex: 'disputeReason',
      key: 'disputeReason'
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'resolved' ? 'green' : 'orange'}>
          {status === 'resolved' ? 'Решен' : 'В процессе'}
        </Tag>
      )
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => formatDateTime(date)
    },
    {
      title: 'Действия',
      key: 'actions',
      render: () => (
        <Button type="link" size="small">
          Подробнее
        </Button>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={transactions}
      rowKey="_id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default DisputedTransactions;
