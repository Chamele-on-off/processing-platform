import React from 'react';
import UsersList from '../../components/Users/UsersList';
import PageHeader from '../../../shared/components/UI/PageHeader';
import { useQuery } from 'react-query';
import api from '../../../services/adminApi';

const UserManagement = () => {
  const { data: stats, isLoading } = useQuery('userStats', () => 
    api.getUserStats()
  );

  return (
    <div className="user-management-page">
      <PageHeader 
        title="Управление пользователями" 
        breadcrumb={[
          { title: 'Главная', link: '/admin/dashboard' },
          { title: 'Пользователи' }
        ]}
      />
      
      {!isLoading && (
        <div className="stats-overview">
          <div className="stat-card">
            <h3>Всего пользователей</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Активных трейдеров</h3>
            <p className="stat-value">{stats.activeTraders}</p>
          </div>
          <div className="stat-card">
            <h3>Активных мерчантов</h3>
            <p className="stat-value">{stats.activeMerchants}</p>
          </div>
        </div>
      )}
      
      <UsersList />
    </div>
  );
};

export default UserManagement;
