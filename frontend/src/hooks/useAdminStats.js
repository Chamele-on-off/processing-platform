import { useQuery } from 'react-query';
import api from '../services/adminApi';

const useAdminStats = () => {
  return useQuery('adminStats', async () => {
    const [stats, activity, recentTransactions] = await Promise.all([
      api.getPlatformStats(),
      api.getActivityStats(),
      api.getRecentTransactions()
    ]);
    
    return {
      ...stats,
      activity,
      recentTransactions
    };
  });
};

export default useAdminStats;
