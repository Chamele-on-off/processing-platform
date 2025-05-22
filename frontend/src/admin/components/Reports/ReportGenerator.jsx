import React, { useState } from 'react';
import { Card, Form, DatePicker, Select, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../../../services/adminApi';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportGenerator = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'transactions', label: 'Отчет по транзакциям' },
    { value: 'users', label: 'Отчет по пользователям' },
    { value: 'tickets', label: 'Отчет по тикетам' },
    { value: 'financial', label: 'Финансовый отчет' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel' }
  ];

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const params = {
        type: values.reportType,
        format: values.format,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString()
      };
      
      const response = await api.generateReport(params);
      
      if (response.data.url) {
        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = `report_${new Date().toISOString()}.${values.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        message.success('Отчет успешно сгенерирован и скачан');
      }
    } catch (error) {
      message.error('Ошибка при генерации отчета');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Генератор отчетов">
      <Form form={form} layout="vertical">
        <Form.Item
          name="reportType"
          label="Тип отчета"
          rules={[{ required: true, message: 'Выберите тип отчета' }]}
        >
          <Select placeholder="Выберите тип отчета">
            {reportTypes.map(type => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="dateRange"
          label="Период"
          rules={[{ required: true, message: 'Выберите период' }]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="format"
          label="Формат"
          rules={[{ required: true, message: 'Выберите формат' }]}
        >
          <Select placeholder="Выберите формат">
            {formats.map(format => (
              <Option key={format.value} value={format.value}>
                {format.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleGenerate}
            loading={loading}
          >
            Сгенерировать отчет
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReportGenerator;
