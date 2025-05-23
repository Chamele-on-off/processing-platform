import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MerchantLayout from '../shared/components/Layout/MerchantLayout';
import MerchantDashboard from '../merchant/pages/MerchantDashboard';
import TransactionHistory from '../merchant/pages/TransactionHistory';
import { ProtectedRoute } from '../shared/components/Auth/AuthRoute';

const MerchantRoutes = () => {
  return (
    <MerchantLayout>
      <Routes>
        <Route path="/dashboard" element={
          <ProtectedRoute role="merchant">
            <MerchantDashboard />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute role="merchant">
            <TransactionHistory />
          </ProtectedRoute>
        } />
      </Routes>
    </MerchantLayout>
  );
};

export default MerchantRoutes;
