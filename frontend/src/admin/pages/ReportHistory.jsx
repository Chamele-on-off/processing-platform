import React from 'react';
import { Table, Tag, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { formatDateTime } from '../../../../utils/formatters';

const ReportHistory = () => {
  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Формат',
      dataIndex: 'format',
      key: 'format',
      render: format => (
        <Tag color={format === 'pdf' ? 'red' : format === 'excel' ? 'green' : 'blue'}>
          {format.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Дата генерации',
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
          icon={<DownloadOutlined />}
          onClick={() => handleDownload(record)}
        >
          Скачать
        </Button>
      )
    }
  ];

  const data = [
    {
      id: '1',
      name: 'Отчет по транзакциям',
      type: 'transactions',
      format: 'pdf',
      createdAt: '2023-05-20T10:30:00Z',
      url: '/reports/transaction_report_20230520.pdf'
    },
    {
      id: '2',
      name: 'Финансовая сводка',
      type: 'financial',
      format: 'excel',
      createdAt: '2023-05-15T14:45:00Z',
      url: '/reports/financial_report_20230515.xlsx'
    }
  ];

  const handleDownload = (report) => {
    // Эмуляция скачивания файла
    const link = document.createElement('a');
    link.href = report.url;
    link.download = report.url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default ReportHistory;
