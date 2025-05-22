import api from '../../../shared/utils/api';

const merchantApi = {
  getMerchant: async (merchantId) => {
    const response = await api.get(`/merchants/${merchantId}`);
    return response.data;
  },

  getPaymentDetails: async (merchantId) => {
    const response = await api.get(`/merchants/${merchantId}/payment-details`);
    return response.data;
  },

  getTransactions: async (merchantId, filters = {}) => {
    const params = {};
    if (filters.dateRange?.length === 2) {
      params.startDate = filters.dateRange[0].toISOString();
      params.endDate = filters.dateRange[1].toISOString();
    }
    if (filters.type !== 'all') params.type = filters.type;
    if (filters.status !== 'all') params.status = filters.status;

    const response = await api.get(`/merchants/${merchantId}/transactions`, { params });
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post('/merchants/orders', orderData);
    return response.data;
  },

  createWithdrawal: async (withdrawalData) => {
    const response = await api.post('/merchants/withdrawals', withdrawalData);
    return response.data;
  },

  updateProfile: async (merchantId, updates) => {
    const response = await api.patch(`/merchants/${merchantId}`, updates);
    return response.data;
  }
};

export default merchantApi;
