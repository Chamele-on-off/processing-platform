import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import AdminRoutes from './routes/AdminRoutes';
import TraderRoutes from './routes/TraderRoutes';
import MerchantRoutes from './routes/MerchantRoutes';
import AuthRoutes from './routes/AuthRoutes';
import LoadingOverlay from './shared/components/UI/LoadingOverlay';
import NotificationCenter from './shared/components/Notifications/NotificationCenter';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <NotificationCenter />
          <LoadingOverlay />
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/trader/*" element={<TraderRoutes />} />
            <Route path="/merchant/*" element={<MerchantRoutes />} />
            <Route path="/*" element={<AuthRoutes />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
