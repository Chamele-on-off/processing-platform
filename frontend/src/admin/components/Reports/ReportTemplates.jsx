import React, { useState } from 'react';
import { Table, Tag, Button, Modal } from 'antd';
import { FilePdfOutlined, FileExcelOutlined, FileTextOutlined } from '@ant-design/icons';

const ReportTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const templates = [
    {
      id: 'daily_transactions',
      name: 'Ежедневный отчет по транзакциям',
      description: 'Сводка всех транзакций за выбранный день',
      formats: ['pdf', 'excel'],
      lastGenerated: '2023-05-15'
    },
    {
      id: 'user_activity',
      name: 'Активность пользователей',
      description: 'Статистика активности пользователей за период',
      formats: ['pdf', 'csv'],
      lastGenerated: '2023-05-10'
    },
    {
      id: 'financial_summary',
      name: 'Финансовая сводка',
      description: 'Общий финансовый отчет по платформе',
      formats: ['pdf', 'excel', 'csv'],
      lastGenerated: '2023-05-01'
    }
  ];

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Форматы',
      dataIndex: 'formats',
      key: 'formats',
      render: formats => (
        <>
          {formats.map(format => (
            <Tag 
              key={format} 
              icon={
                format === 'pdf' ? <FilePdfOutlined /> : 
                format === 'excel' ? <FileExcelOutlined /> : 
                <FileTextOutlined />
              }
              color={
                format === 'pdf' ? 'red' : 
                format === 'excel' ? 'green' : 'blue'
              }
            >
              {format.toUpperCase()}
            </Tag>
          ))}
        </>
      )
    },
    {
      title: 'Последний раз сгенерирован',
      dataIndex: 'lastGenerated',
      key: 'lastGenerated'
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => setSelectedTemplate(record)}
        >
          Использовать шаблон
        </Button>
      )
    }
  ];

  return (
    <div className="report-templates">
      <Table
        columns={columns}
        dataSource={templates}
        rowKey="id"
        pagination={false}
      />
      
      <Modal
        title={`Использование шаблона: ${selectedTemplate?.name}`}
        visible={!!selectedTemplate}
        onCancel={() => setSelectedTemplate(null)}
        footer={null}
      >
        {selectedTemplate && (
          <div>
            <p>{selectedTemplate.description}</p>
            <p>Доступные форматы: {selectedTemplate.formats.join(', ')}</p>
            <Button type="primary">
              Сгенерировать отчет
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportTemplates;
