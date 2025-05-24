import React, { useState } from 'react';
import { Button, Modal, Checkbox, message } from 'antd';
import { CheckSquareOutlined } from '@ant-design/icons';
import traderApi from '../../services/traderApi';

export const BulkProcessing = ({ selectedOrders, refreshOrders }) => {
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState('approve');
  const [loading, setLoading] = useState(false);

  const handleBulkAction = async () => {
    if (!selectedOrders.length) {
      message.warning('Выберите хотя бы один ордер');
      return;
    }

    setLoading(true);
    try {
      await traderApi.bulkProcessOrders({
        orderIds: selectedOrders,
        action
      });
      message.success(`Успешно обработано ${selectedOrders.length} ордеров`);
      refreshOrders();
      setVisible(false);
    } catch (error) {
      message.error('Ошибка при массовой обработке');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        type="default"
        icon={<CheckSquareOutlined />}
        onClick={() => setVisible(true)}
        disabled={!selectedOrders.length}
      >
        Массовая обработка ({selectedOrders.length})
      </Button>

      <Modal
        title="Массовая обработка ордеров"
        visible={visible}
        onOk={handleBulkAction}
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
      >
        <div className="bulk-actions">
          <Checkbox.Group
            options={[
              { label: 'Подтвердить выбранные', value: 'approve' },
              { label: 'Отклонить выбранные', value: 'reject' },
              { label: 'Пометить как спорные', value: 'dispute' }
            ]}
            value={[action]}
            onChange={values => setAction(values[0])}
          />
          <p style={{ marginTop: 16 }}>
            Будет обработано: <strong>{selectedOrders.length}</strong> ордеров
          </p>
        </div>
      </Modal>
    </>
  );
};
