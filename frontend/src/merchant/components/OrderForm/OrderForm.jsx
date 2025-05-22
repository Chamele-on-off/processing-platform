import React, { useState } from 'react';
import { Form, Card, Button, message } from 'antd';
import OrderTypeSelector from './OrderTypeSelector';
import AmountInput from './AmountInput';
import PaymentMethodSelect from './PaymentMethodSelect';
import ConfirmationModal from './ConfirmationModal';
import merchantApi from '../../../services/merchantApi';
import './OrderForm.css';

const OrderForm = ({ merchant, onOrderCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handleSubmit = async (values) => {
    setOrderData(values);
    setShowConfirmation(true);
  };

  const confirmOrder = async () => {
    try {
      setLoading(true);
      const order = await merchantApi.createOrder({
        ...orderData,
        merchantId: merchant.id
      });
      message.success('Заявка успешно создана!');
      form.resetFields();
      onOrderCreated?.(order);
    } catch (error) {
      message.error('Ошибка при создании заявки');
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <Card title="Новая заявка" className="order-form">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ 
            type: 'deposit',
            paymentMethod: 'sbp',
            amount: null
          }}
        >
          <OrderTypeSelector />
          <AmountInput />
          <PaymentMethodSelect />
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
            >
              Создать заявку
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <ConfirmationModal
        visible={showConfirmation}
        onCancel={() => setShowConfirmation(false)}
        onConfirm={confirmOrder}
        loading={loading}
        orderData={orderData}
      />
    </>
  );
};

export default OrderForm;
