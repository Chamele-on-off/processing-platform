import React from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';
import PageHeader from '../../../shared/components/UI/PageHeader';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-page">
      <PageHeader 
        title="Панель управления" 
        breadcrumb={[{ title: 'Главная' }]}
      />
      <Dashboard />
    </div>
  );
};

export default AdminDashboard;
