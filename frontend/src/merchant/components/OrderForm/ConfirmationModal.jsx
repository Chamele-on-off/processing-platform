import React from 'react';
import { Modal, Descriptions, Typography } from 'antd';
import { formatAmount, formatPaymentMethod } from '../../../shared/utils/formatters';

const { Text } = Typography;

const ConfirmationModal = ({ visible, onCancel, onConfirm, loading, orderData }) => {
  const getOperationType = (type) => {
    return type === 'deposit' ? 'Пополнение' : 'Вывод средств';
  };

  return (
    <Modal
      title="Подтверждение заявки"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Подтвердить"
      cancelText="Отмена"
      width={600}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Тип операции">
          <Text strong>{getOperationType(orderData?.type)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Сумма">
          <Text strong>{formatAmount(orderData?.amount)} ₽</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Метод оплаты">
          {formatPaymentMethod(orderData?.paymentMethod)}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          После подтверждения заявка будет отправлена на обработку. 
          Пожалуйста, проверьте правильность введенных данных.
        </Text>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
