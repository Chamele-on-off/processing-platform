import React from 'react';
import StatsCards from './StatsCards';
import ActivityChart from './ActivityChart';
import RecentTransactions from '../../Transactions/TransactionTable';
import { useAdminStats } from '../../../hooks/useAdminStats';

const Dashboard = () => {
  const { stats, loading, error } = useAdminStats();

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Панель управления</h1>
      
      <StatsCards 
        users={stats.users} 
        transactions={stats.transactions} 
        orders={stats.orders} 
      />
      
      <div className="dashboard-grid">
        <div className="chart-section">
          <ActivityChart data={stats.activity} />
        </div>
        
        <div className="transactions-section">
          <h2>Последние транзакции</h2>
          <RecentTransactions 
            transactions={stats.recentTransactions} 
            limit={5} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
