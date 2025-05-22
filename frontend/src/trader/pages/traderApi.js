import api from '../../shared/utils/api';

const traderApi = {
  // Заявки
  getOrders: async (filters) => {
    const response = await api.get('/trader/orders', { params: filters });
    return response.data;
  },

  acceptOrder: async (orderId, traderId) => {
    const response = await api.post(`/trader/orders/${orderId}/accept`, { traderId });
    return response.data;
  },

  rejectOrder: async (orderId, traderId) => {
    const response = await api.post(`/trader/orders/${orderId}/reject`, { traderId });
    return response.data;
  },

  // Реквизиты
  getPaymentDetails: async (traderId) => {
    const response = await api.get(`/trader/${traderId}/payment-details`);
    return response.data;
  },

  addPaymentDetail: async (traderId, detail) => {
    const response = await api.post(`/trader/${traderId}/payment-details`, detail);
    return response.data;
  },

  updatePaymentDetail: async (id, updates) => {
    const response = await api.patch(`/trader/payment-details/${id}`, updates);
    return response.data;
  },

  deletePaymentDetail: async (id) => {
    const response = await api.delete(`/trader/payment-details/${id}`);
    return response.data;
  },

  // Статистика
  getTraderStats: async (traderId, period = '7d') => {
    const response = await api.get(`/trader/${traderId}/stats`, {
      params: { period }
    });
    return response.data;
  },

  // Споры
  getDisputes: async (traderId) => {
    const response = await api.get(`/trader/${traderId}/disputes`);
    return response.data;
  },

  resolveDispute: async (disputeId, resolution) => {
    const response = await api.post(`/trader/disputes/${disputeId}/resolve`, { resolution });
    return response.data;
  },

  // Баланс
  getBalance: async (traderId) => {
    const response = await api.get(`/trader/${traderId}/balance`);
    return response.data;
  },

  withdrawFunds: async (traderId, amount, method) => {
    const response = await api.post(`/trader/${traderId}/withdraw`, { amount, method });
    return response.data;
  }
};

export default traderApi;
