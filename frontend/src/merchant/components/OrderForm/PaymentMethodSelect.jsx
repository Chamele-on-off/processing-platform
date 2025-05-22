import React from 'react';
import { Form, Select } from 'antd';
import {
  BankOutlined,
  CreditCardOutlined,
  QrcodeOutlined,
  WalletOutlined
} from '@ant-design/icons';

const { Option } = Select;

const PaymentMethodSelect = () => {
  return (
    <Form.Item
      name="paymentMethod"
      label="Метод оплаты"
      rules={[{ required: true, message: 'Выберите метод оплаты' }]}
    >
      <Select
        placeholder="Выберите метод оплаты"
        size="large"
      >
        <Option value="sbp">
          <BankOutlined /> СБП (Система быстрых платежей)
        </Option>
        <Option value="card">
          <CreditCardOutlined /> Банковская карта
        </Option>
        <Option value="qr">
          <QrcodeOutlined /> QR-код
        </Option>
        <Option value="ewallet">
          <WalletOutlined /> Электронный кошелек
        </Option>
      </Select>
    </Form.Item>
  );
};

export default PaymentMethodSelect;
