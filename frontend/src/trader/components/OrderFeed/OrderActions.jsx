import React, { useState } from 'react';
import { Button, Modal, message, Space } from 'antd';
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import traderApi from '../../services/traderApi';

const { confirm } = Modal;

const OrderActions = ({ order, traderId }) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await traderApi.acceptOrder(order.id, traderId);
      message.success('Заявка принята в обработку');
    } catch (error) {
      message.error('Ошибка при принятии заявки');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    confirm({
      title: 'Отклонить заявку?',
      icon: <ExclamationCircleOutlined />,
      content: 'Вы уверены, что хотите отклонить эту заявку?',
      okText: 'Да, отклонить',
      cancelText: 'Отмена',
      onOk: async () => {
        setLoading(true);
        try {
          await traderApi.rejectOrder(order.id, traderId);
          message.success('Заявка отклонена');
        } catch (error) {
          message.error('Ошибка при отклонении заявки');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <Space>
      <Button
        type="primary"
        icon={<CheckOutlined />}
        loading={loading}
        onClick={handleAccept}
        disabled={order.status !== 'pending'}
      >
        Принять
      </Button>
      <Button
        danger
        icon={<CloseOutlined />}
        loading={loading}
        onClick={handleReject}
        disabled={order.status !== 'pending'}
      >
        Отклонить
      </Button>
    </Space>
  );
};

export default OrderActions;
