import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../shared/components/Layout/AuthLayout';
import LoginForm from '../shared/components/Auth/LoginForm';
import RegisterForm from '../shared/components/Auth/RegisterForm';
import ForgotPasswordForm from '../shared/components/Auth/ForgotPasswordForm';
import { useAuth } from '../shared/hooks/useAuth';

const AuthRoutes = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : 
                      user.role === 'trader' ? '/trader/dashboard' : 
                      '/merchant/dashboard'} />;
  }

  return (
    <AuthLayout>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthLayout>
  );
};

export default AuthRoutes;
