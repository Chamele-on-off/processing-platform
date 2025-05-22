import React from 'react';
import { DatePicker, Select, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    dateRange: [],
    type: '',
    status: ''
  });

  const handleDateChange = (dates) => {
    setFilters({ ...filters, dateRange: dates });
  };

  const handleTypeChange = (value) => {
    setFilters({ ...filters, type: value });
  };

  const handleStatusChange = (value) => {
    setFilters({ ...filters, status: value });
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({ dateRange: [], type: '', status: '' });
    onFilterChange({});
  };

  return (
    <Space size="middle" style={{ marginBottom: 16 }}>
      <RangePicker 
        onChange={handleDateChange} 
        value={filters.dateRange} 
      />
      
      <Select
        placeholder="Тип транзакции"
        style={{ width: 150 }}
        onChange={handleTypeChange}
        value={filters.type}
        allowClear
      >
        <Option value="deposit">Депозит</Option>
        <Option value="withdrawal">Вывод</Option>
      </Select>
      
      <Select
        placeholder="Статус"
        style={{ width: 150 }}
        onChange={handleStatusChange}
        value={filters.status}
        allowClear
      >
        <Option value="pending">В ожидании</Option>
        <Option value="completed">Завершено</Option>
        <Option value="failed">Ошибка</Option>
        <Option value="disputed">Спор</Option>
      </Select>
      
      <Button 
        type="primary" 
        icon={<SearchOutlined />} 
        onClick={handleApply}
      >
        Применить
      </Button>
      
      <Button 
        icon={<ReloadOutlined />} 
        onClick={handleReset}
      >
        Сбросить
      </Button>
    </Space>
  );
};

export default TransactionFilters;
