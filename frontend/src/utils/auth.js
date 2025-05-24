// src/utils/auth.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Основные функции аутентификации
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return !!user?.token;
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || 'null');
};

export const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user?.token;
};

// Настройка axios для автоматической авторизации
axios.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
