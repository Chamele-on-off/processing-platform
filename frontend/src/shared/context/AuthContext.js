import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { getToken, setToken, clearToken } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (err) {
          clearToken();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
