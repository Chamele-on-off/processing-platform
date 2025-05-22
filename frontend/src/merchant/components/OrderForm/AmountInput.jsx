import React from 'react';
import { Form, Input, InputNumber } from 'antd';

const AmountInput = () => {
  return (
    <Form.Item
      name="amount"
      label="Сумма"
      rules={[
        { required: true, message: 'Введите сумму' },
        { type: 'number', min: 100, message: 'Минимальная сумма 100 ₽' },
        { type: 'number', max: 1000000, message: 'Максимальная сумма 1 000 000 ₽' }
      ]}
    >
      <InputNumber
        style={{ width: '100%' }}
        placeholder="Введите сумму в рублях"
        min={100}
        max={1000000}
        step={100}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        parser={(value) => value.replace(/\s/g, '')}
        size="large"
      />
    </Form.Item>
  );
};

export default AmountInput;
