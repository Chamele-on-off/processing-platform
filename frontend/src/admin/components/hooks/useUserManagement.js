import { useState, useEffect } from 'react';
import userService from '../services/userService';

export const useUserManagement = (userType, page = 1, limit = 10) => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, total } = await userService.getUsers(userType, page, limit);
      setUsers(data);
      setTotal(total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userType, page, limit]);

  const updateUser = async (userId, updates) => {
    try {
      await userService.updateUser(userId, updates);
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  return { users, total, loading, error, fetchUsers, updateUser };
};
