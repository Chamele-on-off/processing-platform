import api from '../shared/utils/api';

const adminApi = {
  getPlatformStats: () => api.get('/admin/stats'),
  getActivityStats: () => api.get('/admin/stats/activity'),
  getRecentTransactions: () => api.get('/admin/transactions?limit=5'),
  
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  flagTransaction: (id, reason) => api.post(`/admin/transactions/${id}/flag`, { reason })
};

export default adminApi;
