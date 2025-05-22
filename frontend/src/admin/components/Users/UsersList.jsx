import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Table, Input, Select, Button, Space, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import UserEditModal from './UserEditModal';
import api from '../../../../services/adminApi';

const { Search } = Input;
const { Option } = Select;

const UsersList = () => {
  const [searchParams, setSearchParams] = useState({
    role: '',
    status: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, isLoading, refetch } = useQuery(
    ['users', pagination, searchParams],
    () => api.getUsers({ ...pagination, ...searchParams })
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => id.slice(-6)
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'purple' : role === 'trader' ? 'blue' : 'green'}>
          {role === 'admin' ? 'Админ' : role === 'trader' ? 'Трейдер' : 'Мерчант'}
        </Tag>
      )
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : status === 'suspended' ? 'orange' : 'red'}>
          {status === 'active' ? 'Активен' : status === 'suspended' ? 'Приостановлен' : 'Заблокирован'}
        </Tag>
      )
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => {
            setSelectedUser(record);
            setEditModalVisible(true);
          }}>
            Редактировать
          </Button>
        </Space>
      )
    }
  ];

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleSearch = (value) => {
    setSearchParams({ ...searchParams, search: value });
  };

  const handleReset = () => {
    setSearchParams({ role: '', status: '', search: '' });
    setPagination({ current: 1, pageSize: 10 });
  };

  return (
    <div className="users-list">
      <div className="users-filters">
        <Search
          placeholder="Поиск по имени или email"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        
        <Select
          placeholder="Роль"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => setSearchParams({ ...searchParams, role: value })}
          value={searchParams.role}
        >
          <Option value="admin">Админ</Option>
          <Option value="trader">Трейдер</Option>
          <Option value="merchant">Мерчант</Option>
        </Select>
        
        <Select
          placeholder="Статус"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => setSearchParams({ ...searchParams, status: value })}
          value={searchParams.status}
        >
          <Option value="active">Активен</Option>
          <Option value="suspended">Приостановлен</Option>
          <Option value="banned">Заблокирован</Option>
        </Select>
        
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Сбросить
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={data?.users}
        rowKey="_id"
        loading={isLoading}
        pagination={{
          ...pagination,
          total: data?.total,
          showSizeChanger: true
        }}
        onChange={handleTableChange}
      />
      
      <UserEditModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        user={selectedUser}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default UsersList;
