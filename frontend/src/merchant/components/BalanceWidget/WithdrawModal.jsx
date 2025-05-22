import React, { useState } from 'react';
import { Modal, Form, InputNumber, Select, message } from 'antd';
import { 
  ArrowUpOutlined,
  WalletOutlined,
  BankOutlined 
} from '@ant-design/icons';
import merchantApi from '../../../services/merchantApi';
import './BalanceWidget.css';

const { Option } = Select;

const WithdrawModal = ({ 
  visible, 
  onCancel, 
  onSuccess,
  balance,
  paymentDetails 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      await merchantApi.createWithdrawal({
        amount: values.amount,
        paymentDetailId: values.paymentDetailId
      });

      message.success('Заявка на вывод создана');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при выводе средств');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <ArrowUpOutlined />
          <span>Заявка на вывод средств</span>
        </Space>
      }
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Вывести"
      cancelText="Отмена"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ amount: balance?.available }}
      >
        <Form.Item
          name="amount"
          label="Сумма вывода"
          rules={[
            { required: true, message: 'Введите сумму' },
            { 
              type: 'number', 
              min: 100, 
              message: 'Минимальная сумма 100 ₽' 
            },
            { 
              type: 'number', 
              max: balance?.available || 0,
              message: 'Недостаточно средств' 
            }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={`Макс. ${balance?.available?.toFixed(2)} ₽`}
            min={100}
            max={balance?.available || 0}
            step={100}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            parser={(value) => value.replace(/\s/g, '')}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="paymentDetailId"
          label="Куда перевести"
          rules={[{ required: true, message: 'Выберите реквизиты' }]}
        >
          <Select
            placeholder="Выберите реквизиты"
            size="large"
            optionLabelProp="label"
          >
            {paymentDetails?.map(detail => (
              <Option 
                key={detail.id} 
                value={detail.id}
                label={
                  <Space>
                    {detail.type === 'bank_account' ? <BankOutlined /> : <WalletOutlined />}
                    {detail.paymentSystem}
                  </Space>
                }
              >
                <div className="payment-detail-option">
                  <div className="payment-method">
                    {detail.paymentSystem} ({detail.type === 'bank_account' ? 'Счет' : 'Кошелек'})
                  </div>
                  <div className="payment-details">
                    {detail.details.slice(0, 30)}...
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WithdrawModal;
