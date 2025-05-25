import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('auth'));
    if (storedAuth?.token) {
      setUser(storedAuth.user);
    }
  }, []);

  const login = async (email, password) => {
    const data = await auth.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: auth.isAuthenticated(),
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
