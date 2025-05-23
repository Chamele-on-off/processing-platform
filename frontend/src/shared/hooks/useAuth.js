import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, login, logout } = context;

  const checkAuth = async () => {
    try {
      await api.get('/auth/verify');
      return true;
    } catch (error) {
      logout();
      navigate('/login');
      return false;
    }
  };

  const hasRole = (requiredRole) => {
    return user?.roles?.includes(requiredRole);
  };

  const hasAnyRole = (roles) => {
    return roles.some(role => user?.roles?.includes(role));
  };

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user
  };
};
