import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TraderLayout from '../shared/components/Layout/TraderLayout';
import TraderDashboard from '../trader/pages/TraderDashboard';
import DisputeCenter from '../trader/pages/DisputeCenter';
import { ProtectedRoute } from '../shared/components/Auth/AuthRoute';

const TraderRoutes = () => {
  return (
    <TraderLayout>
      <Routes>
        <Route path="/dashboard" element={
          <ProtectedRoute role="trader">
            <TraderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/disputes" element={
          <ProtectedRoute role="trader">
            <DisputeCenter />
          </ProtectedRoute>
        } />
      </Routes>
    </TraderLayout>
  );
};

export default TraderRoutes;
