import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Descriptions, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import traderApi from '../services/traderApi';
import './DisputeCenter.css';

const { confirm } = Modal;

const DisputeCenter = ({ traderId }) => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);

  useEffect(() => {
    fetchDisputes();
  }, [traderId]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await traderApi.getDisputes(traderId);
      setDisputes(data);
    } catch (error) {
      message.error('Ошибка загрузки споров');
    } finally {
      setLoading(false);
    }
  };

  const showDetails = (dispute) => {
    setSelectedDispute(dispute);
  };

  const handleResolve = (id, resolution) => {
    confirm({
      title: `Вы уверены, что хотите ${resolution === 'approve' ? 'одобрить' : 'отклонить'} спор?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          await traderApi.resolveDispute(id, resolution);
          message.success(`Спор ${resolution === 'approve' ? 'одобрен' : 'отклонен'}`);
          fetchDisputes();
        } catch (error) {
          message.error('Ошибка при обработке спора');
        }
      }
    });
  };

  const columns = [
    {
      title: 'ID заявки',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => `#${id}`
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'incoming' ? 'cyan' : 'purple'}>
          {type === 'incoming' ? 'Входящая' : 'Исходящая'}
        </Tag>
      )
    },
    {
      title: 'Сумма',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount} ₽`
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          open: { color: 'orange', text: 'Открыт' },
          resolved: { color: 'green', text: 'Решен' },
          rejected: { color: 'red', text: 'Отклонен' }
        };
        const statusInfo = statusMap[status] || { color: 'gray', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => showDetails(record)}>Подробности</Button>
          {record.status === 'open' && (
            <>
              <Button 
                type="primary" 
                onClick={() => handleResolve(record.id, 'approve')}
              >
                Одобрить
              </Button>
              <Button 
                danger 
                onClick={() => handleResolve(record.id, 'reject')}
              >
                Отклонить
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="dispute-center">
      <Table
        columns={columns}
        dataSource={disputes}
        rowKey="id"
        loading={loading}
        bordered
        title={() => <h3>Центр разрешения споров</h3>}
      />

      <Modal
        title={`Детали спора #${selectedDispute?.id}`}
        visible={!!selectedDispute}
        onCancel={() => setSelectedDispute(null)}
        footer={null}
        width={700}
      >
        {selectedDispute && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID заявки">
              #{selectedDispute.orderId}
            </Descriptions.Item>
            <Descriptions.Item label="Сумма">
              {selectedDispute.amount} ₽
            </Descriptions.Item>
            <Descriptions.Item label="Тип">
              {selectedDispute.type === 'incoming' ? 'Входящая' : 'Исходящая'}
            </Descriptions.Item>
            <Descriptions.Item label="Причина">
              {selectedDispute.reason}
            </Descriptions.Item>
            <Descriptions.Item label="Комментарий трейдера">
              {selectedDispute.traderComment || 'Нет комментария'}
            </Descriptions.Item>
            <Descriptions.Item label="Доказательства">
              {selectedDispute.evidence ? (
                <a href={selectedDispute.evidence} target="_blank" rel="noopener noreferrer">
                  Просмотреть
                </a>
              ) : 'Нет приложенных файлов'}
            </Descriptions.Item>
            <Descriptions.Item label="Дата создания">
              {new Date(selectedDispute.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default DisputeCenter;
