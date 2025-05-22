import React, { useState, useEffect } from 'react';
import { Card, Button, List, Spin, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddPaymentDetail from './AddPaymentDetail';
import EditPaymentDetail from './EditPaymentDetail';
import DetailItem from './DetailItem';
import traderApi from '../../services/traderApi';
import './PaymentDetails.css';

const PaymentDetailsList = ({ traderId }) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);

  useEffect(() => {
    fetchPaymentDetails();
  }, [traderId]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const data = await traderApi.getPaymentDetails(traderId);
      setDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalVisible(false);
    fetchPaymentDetails();
    message.success('Реквизит успешно добавлен');
  };

  const handleEdit = (detail) => {
    setEditingDetail(detail);
  };

  const handleEditSuccess = () => {
    setEditingDetail(null);
    fetchPaymentDetails();
    message.success('Реквизит успешно обновлен');
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Удалить реквизит?',
      content: 'Вы уверены, что хотите удалить этот реквизит?',
      okText: 'Удалить',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await traderApi.deletePaymentDetail(id);
          message.success('Реквизит удален');
          fetchPaymentDetails();
        } catch (err) {
          message.error('Ошибка при удалении реквизита');
        }
      }
    });
  };

  return (
    <Card 
      title="Мои реквизиты" 
      bordered={false}
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          Добавить реквизит
        </Button>
      }
    >
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <List
          dataSource={details}
          renderItem={(item) => (
            <DetailItem 
              item={item} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          locale={{ emptyText: 'Нет добавленных реквизитов' }}
        />
      )}

      <AddPaymentDetail
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSuccess={handleAddSuccess}
        traderId={traderId}
      />

      {editingDetail && (
        <EditPaymentDetail
          detail={editingDetail}
          onCancel={() => setEditingDetail(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </Card>
  );
};

export default PaymentDetailsList;
