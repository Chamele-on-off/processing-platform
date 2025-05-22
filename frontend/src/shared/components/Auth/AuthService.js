import api from './api';

const AuthService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  saveCredentials: (email) => {
    localStorage.setItem('rememberedEmail', email);
  },

  getRememberedEmail: () => {
    return localStorage.getItem('rememberedEmail');
  },

  clearRememberedEmail: () => {
    localStorage.removeItem('rememberedEmail');
  }
};

export default AuthService;
