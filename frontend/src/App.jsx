import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import Layout from './shared/components/Layout/Layout';
import LoginPage from './shared/components/Auth/LoginPage';
import AdminRoutes from './routes/AdminRoutes';
import TraderRoutes from './routes/TraderRoutes';
import MerchantRoutes from './routes/MerchantRoutes';
import NotFoundPage from './shared/components/UI/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/trader/*" element={<TraderRoutes />} />
            <Route path="/merchant/*" element={<MerchantRoutes />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
