import { useState, useEffect, useContext, createContext } from 'react';
import AuthService from '../services/AuthService';

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Здесь можно добавить проверку токена
        // const user = await AuthService.checkAuth();
        // setUser(user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const user = await AuthService.login(email, password);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const user = await AuthService.register(userData);
    setUser(user);
    return user;
  };

  const logout = async () => {
    // await AuthService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout
  };
}
