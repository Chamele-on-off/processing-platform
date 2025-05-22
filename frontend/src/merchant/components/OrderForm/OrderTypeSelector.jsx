import React from 'react';
import { Form, Radio } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

const OrderTypeSelector = () => {
  return (
    <Form.Item 
      name="type" 
      label="Тип операции"
      rules={[{ required: true, message: 'Выберите тип операции' }]}
    >
      <Radio.Group buttonStyle="solid">
        <Radio.Button value="deposit">
          <ArrowDownOutlined /> Депозит
        </Radio.Button>
        <Radio.Button value="withdraw">
          <ArrowUpOutlined /> Вывод
        </Radio.Button>
      </Radio.Group>
    </Form.Item>
  );
};

export default OrderTypeSelector;
