import api from '../../shared/utils/api';

const userService = {
  getUsers: async (userType, page = 1, limit = 10) => {
    const response = await api.get(`/admin/users`, {
      params: { type: userType, page, limit }
    });
    return response.data;
  },

  updateUser: async (userId, updates) => {
    const response = await api.patch(`/admin/users/${userId}`, updates);
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/block`);
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/unblock`);
    return response.data;
  },
};

export default userService;
