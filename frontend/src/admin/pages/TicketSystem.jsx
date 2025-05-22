import React, { useState } from 'react';
import { Button, Card, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TicketList from '../../components/Tickets/TicketList';
import NewTicketModal from '../../components/Tickets/NewTicketModal';
import PageHeader from '../../../shared/components/UI/PageHeader';
import { useQuery } from 'react-query';
import api from '../../../services/adminApi';

const { TabPane } = Tabs;

const TicketSystem = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('open');
  
  const { data: tickets, isLoading, refetch } = useQuery(
    ['tickets', activeTab],
    () => api.getTickets({ status: activeTab })
  );

  return (
    <div className="ticket-system-page">
      <PageHeader 
        title="Система тикетов" 
        breadcrumb={[
          { title: 'Главная', link: '/admin/dashboard' },
          { title: 'Тикеты' }
        ]}
        extra={[
          <Button 
            key="new-ticket" 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Новый тикет
          </Button>
        ]}
      />
      
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Открытые" key="open" />
          <TabPane tab="В работе" key="in_progress" />
          <TabPane tab="Решенные" key="resolved" />
          <TabPane tab="Все" key="all" />
        </Tabs>
        
        <TicketList 
          tickets={tickets} 
          loading={isLoading}
          onRefresh={refetch}
        />
      </Card>
      
      <NewTicketModal 
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={() => {
          refetch();
          setModalVisible(false);
        }}
      />
    </div>
  );
};

export default TicketSystem;
