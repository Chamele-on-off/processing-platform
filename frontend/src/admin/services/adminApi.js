import api from '../../shared/utils/api';

const adminApi = {
  getDashboardStats: async (timeRange) => {
    const response = await api.get(`/admin/stats?range=${timeRange}`);
    return response.data;
  },

  getTransactions: async (filters) => {
    const response = await api.get('/admin/transactions', { params: filters });
    return response.data;
  },

  getTickets: async (status) => {
    const response = await api.get('/admin/tickets', { params: { status } });
    return response.data;
  },

  generateReport: async (params) => {
    const response = await api.post('/admin/reports', params);
    return response.data;
  },
};

export default adminApi;
