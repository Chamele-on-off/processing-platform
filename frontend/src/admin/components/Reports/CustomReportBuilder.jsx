import React, { useState } from 'react';
import { Button, Select, DatePicker, Table } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../services/adminApi';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const CustomReportBuilder = () => {
  const [reportType, setReportType] = useState('transactions');
  const [dateRange, setDateRange] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'transactions', label: 'Транзакции' },
    { value: 'users', label: 'Пользователи' },
    { value: 'disputes', label: 'Диспуты' }
  ];

  const columnOptions = {
    transactions: [
      { value: 'id', label: 'ID' },
      { value: 'amount', label: 'Сумма' },
      { value: 'status', label: 'Статус' }
    ],
    users: [
      { value: 'id', label: 'ID' },
      { value: 'email', label: 'Email' },
      { value: 'role', label: 'Роль' }
    ]
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await api.generateReport({
        type: reportType,
        startDate: dateRange[0],
        endDate: dateRange[1],
        columns: columns
      });
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-builder">
      <div className="report-controls">
        <Select
          value={reportType}
          onChange={setReportType}
          style={{ width: 200 }}
        >
          {reportTypes.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>

        <RangePicker 
          onChange={setDateRange} 
          style={{ margin: '0 16px' }}
        />

        <Select
          mode="multiple"
          placeholder="Выберите колонки"
          value={columns}
          onChange={setColumns}
          style={{ width: 300 }}
        >
          {columnOptions[reportType]?.map(col => (
            <Option key={col.value} value={col.value}>
              {col.label}
            </Option>
          ))}
        </Select>

        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={generateReport}
          loading={loading}
          style={{ marginLeft: 16 }}
        >
          Сгенерировать
        </Button>
      </div>

      <Table 
        columns={columns.map(col => ({
          title: columnOptions[reportType]?.find(c => c.value === col)?.label || col,
          dataIndex: col,
          key: col
        }))}
        dataSource={data}
        rowKey="id"
      />
    </div>
  );
};
