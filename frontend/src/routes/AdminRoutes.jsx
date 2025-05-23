import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../shared/components/Layout/AdminLayout';
import AdminDashboard from '../admin/pages/AdminDashboard';
import UserManagement from '../admin/pages/UserManagement';
import TransactionMonitoring from '../admin/pages/TransactionMonitoring';
import TicketSystem from '../admin/pages/TicketSystem';
import Reporting from '../admin/pages/Reporting';
import { ProtectedRoute } from '../shared/components/Auth/AuthRoute';

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute role="admin">
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute role="admin">
            <TransactionMonitoring />
          </ProtectedRoute>
        } />
        <Route path="/tickets" element={
          <ProtectedRoute role="admin">
            <TicketSystem />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute role="admin">
            <Reporting />
          </ProtectedRoute>
        } />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
