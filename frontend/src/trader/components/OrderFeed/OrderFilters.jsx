import React from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

const OrderFilters = ({ onFilterChange }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onFilterChange(values);
  };

  const handleReset = () => {
    form.resetFields();
    onFilterChange({
      type: 'incoming',
      status: 'pending',
      minAmount: null,
      maxAmount: null,
      paymentMethod: 'all'
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        type: 'incoming',
        status: 'pending',
        paymentMethod: 'all'
      }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="type" label="Тип заявки">
            <Select>
              <Option value="incoming">Входящие</Option>
              <Option value="outgoing">Исходящие</Option>
              <Option value="all">Все</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="status" label="Статус">
            <Select>
              <Option value="pending">Ожидание</Option>
              <Option value="processing">В обработке</Option>
              <Option value="completed">Завершено</Option>
              <Option value="disputed">Спор</Option>
              <Option value="all">Все</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="paymentMethod" label="Метод оплаты">
            <Select>
              <Option value="sbp">СБП</Option>
              <Option value="c2c">P2P</Option>
              <Option value="qr">QR</Option>
              <Option value="all">Все</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="minAmount" label="Мин. сумма">
            <Input type="number" placeholder="Любая" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="maxAmount" label="Макс. сумма">
            <Input type="number" placeholder="Любая" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<FilterOutlined />}
              >
                Применить фильтры
              </Button>
              <Button onClick={handleReset}>Сбросить</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default OrderFilters;
