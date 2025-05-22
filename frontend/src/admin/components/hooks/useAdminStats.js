import { useState, useEffect } from 'react';
import adminApi from '../services/adminApi';

export const useAdminStats = (timeRange = '7d') => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getDashboardStats(timeRange);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  return { stats, loading, error };
};
