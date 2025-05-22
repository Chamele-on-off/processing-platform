import React, { useState } from 'react';
import { Table, Tag, Button, Space, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { formatDateTime } from '../../../../utils/formatters';
import TicketDetail from './TicketDetail';

const { Search } = Input;
const { Option } = Select;

const TicketList = ({ tickets, loading, onRefresh }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });

  const statusColors = {
    open: 'blue',
    in_progress: 'orange',
    resolved: 'green',
    closed: 'gray'
  };

  const statusNames = {
    open: 'Открыт',
    in_progress: 'В работе',
    resolved: 'Решен',
    closed: 'Закрыт'
  };

  const typeNames = {
    technical: 'Технический',
    financial: 'Финансовый',
    dispute: 'Спор',
    other: 'Другой'
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: id => id.slice(-6)
    },
    {
      title: 'Тема',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: type => typeNames[type] || type
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={statusColors[status]}>
          {statusNames[status]}
        </Tag>
      )
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
      render: priority => (
        <Tag color={
          priority === 5 ? 'red' : 
          priority === 4 ? 'orange' : 
          priority === 3 ? 'yellow' : 
          'blue'
        }>
          {priority}
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
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => setSelectedTicket(record)}
        >
          Подробнее
        </Button>
      )
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    return (
      (!filters.status || ticket.status === filters.status) &&
      (!filters.type || ticket.type === filters.type) &&
      (!filters.search || 
        ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket._id.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  return (
    <div className="ticket-list">
      <div className="ticket-filters">
        <Space size="middle" style={{ marginBottom: 16 }}>
          <Search
            placeholder="Поиск по теме или ID"
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
            onSearch={value => setFilters({...filters, search: value})}
          />
          
          <Select
            placeholder="Статус"
            allowClear
            style={{ width: 150 }}
            onChange={value => setFilters({...filters, status: value})}
          >
            <Option value="open">Открыт</Option>
            <Option value="in_progress">В работе</Option>
            <Option value="resolved">Решен</Option>
            <Option value="closed">Закрыт</Option>
          </Select>
          
          <Select
            placeholder="Тип"
            allowClear
            style={{ width: 150 }}
            onChange={value => setFilters({...filters, type: value})}
          >
            <Option value="technical">Технический</Option>
            <Option value="financial">Финансовый</Option>
            <Option value="dispute">Спор</Option>
            <Option value="other">Другой</Option>
          </Select>
          
          <Button onClick={onRefresh}>
            Обновить
          </Button>
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredTickets}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={onRefresh}
        />
      )}
    </div>
  );
};

export default TicketList;
