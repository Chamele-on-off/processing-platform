import React, { useState } from 'react';
import { Table, Button, DatePicker, InputNumber, Modal } from 'antd';
import { PlusOutlined } from '@ant-design-icons';
import merchantApi from '../../services/merchantApi';

export const ScheduledPayouts = ({ payouts, refreshData }) => {
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Дата выплаты',
      dataIndex: 'payoutDate',
      key: 'payoutDate',
      render: date => new Date(date).toLocaleDateString()
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => `${amount.toFixed(2)} ₽`
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status'
    }
  ];

  const schedulePayout = async () => {
    if (!amount || !date) return;

    setLoading(true);
    try {
      await merchantApi.schedulePayout({
        amount,
        payoutDate: date.toISOString()
      });
      refreshData();
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scheduled-payouts">
      <div className="payouts-header">
        <h3>Запланированные выплаты</h3>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
        >
          Запланировать
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={payouts}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title="Запланировать выплату"
        visible={visible}
        onOk={schedulePayout}
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
      >
        <div className="payout-form">
          <div className="form-item">
            <label>Сумма:</label>
            <InputNumber
              value={amount}
              onChange={setAmount}
              min={100}
              step={100}
              style={{ width: '100%' }}
              addonAfter="₽"
            />
          </div>

          <div className="form-item">
            <label>Дата выплаты:</label>
            <DatePicker
              value={date}
              onChange={setDate}
              style={{ width: '100%' }}
              disabledDate={current => current && current < moment().endOf('day')}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
