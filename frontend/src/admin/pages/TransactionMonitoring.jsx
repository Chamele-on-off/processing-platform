import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import TransactionTable from '../../components/Transactions/TransactionTable';
import TransactionFilters from '../../components/Transactions/TransactionFilters';
import DisputedTransactions from '../../components/Transactions/DisputedTransactions';
import PageHeader from '../../../shared/components/UI/PageHeader';
import { useQuery } from 'react-query';
import api from '../../../services/adminApi';

const { TabPane } = Tabs;

const TransactionMonitoring = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({});
  
  const { data: transactions, isLoading } = useQuery(
    ['transactions', filters], 
    () => api.getTransactions(filters)
  );
  
  const { data: disputed, isLoading: isDisputedLoading } = useQuery(
    'disputedTransactions',
    () => api.getDisputedTransactions()
  );

  return (
    <div className="transaction-monitoring-page">
      <PageHeader 
        title="Мониторинг транзакций" 
        breadcrumb={[
          { title: 'Главная', link: '/admin/dashboard' },
          { title: 'Транзакции' }
        ]}
      />
      
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            activeTab === 'all' && (
              <TransactionFilters 
                onFilterChange={setFilters} 
              />
            )
          }
        >
          <TabPane tab="Все транзакции" key="all">
            <TransactionTable 
              transactions={transactions} 
              loading={isLoading}
              showPagination
            />
          </TabPane>
          <TabPane tab="Спорные транзакции" key="disputed">
            <DisputedTransactions 
              transactions={disputed} 
              loading={isDisputedLoading}
            />
          </TabPane>
          <TabPane tab="Флагированные" key="flagged">
            {/* Компонент для флагированных транзакций */}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default TransactionMonitoring;
