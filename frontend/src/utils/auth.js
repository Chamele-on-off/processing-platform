// src/utils/auth.js
import axios from 'axios';
import { API_URL } from '../config';

// Функция для входа пользователя
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

// Функция для выхода
export const logout = () => {
  localStorage.removeItem('user');
};

// Проверка аутентификации
export const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return !!user?.token;
};

// Получение текущего пользователя
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Функция для регистрации
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Получение токена
export const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

// Интерцептор для axios
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });
};
