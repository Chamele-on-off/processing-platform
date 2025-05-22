const Transaction = require('../../../common/models/transaction.model');
const Order = require('../../../common/models/order.model');
const { calculateTimeDifference } = require('../../../common/utils/helpers');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getTraderStatistics(traderId, period = 'month') {
    try {
      const dateFilter = this.getDateFilter(period);
      
      const [transactions, orders] = await Promise.all([
        Transaction.aggregate([
          { $match: { trader: traderId, createdAt: dateFilter } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' }
            }
          }
        ]),
        Order.aggregate([
          { $match: { assignedTrader: traderId, createdAt: dateFilter } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' }
            }
          }
        ])
      ]);

      const performance = await this.calculatePerformanceMetrics(traderId, dateFilter);

      return {
        transactions,
        orders,
        performance,
        period
      };
    } catch (error) {
      logger.error(`Failed to get statistics for trader ${traderId}:`, error);
      throw error;
    }
  },

  async getPerformanceMetrics(traderId) {
    try {
      const completedTransactions = await Transaction.find({
        trader: traderId,
        status: 'completed'
      }).sort({ completedAt: -1 }).limit(100);

      if (completedTransactions.length === 0) {
        return {
          avgProcessingTime: 0,
          completionRate: 0,
          disputeRate: 0
        };
      }

      const processingTimes = completedTransactions.map(tx => 
        calculateTimeDifference(tx.processingStartedAt, tx.completedAt)
      );

      const totalDisputes = await Transaction.countDocuments({
        trader: traderId,
        status: 'disputed'
      });

      const avgProcessingTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
      const completionRate = (completedTransactions.length / (completedTransactions.length + totalDisputes)) * 100;
      const disputeRate = (totalDisputes / completedTransactions.length) * 100;

      return {
        avgProcessingTime,
        completionRate,
        disputeRate,
        totalTransactions: completedTransactions.length + totalDisputes
      };
    } catch (error) {
      logger.error(`Failed to get performance metrics for trader ${traderId}:`, error);
      throw error;
    }
  },

  async getEarningsReport(traderId, startDate, endDate) {
    try {
      const transactions = await Transaction.aggregate([
        {
          $match: {
            trader: traderId,
            status: 'completed',
            completedAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$completedAt" }
            },
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const totalEarnings = transactions.reduce((sum, day) => sum + day.totalAmount, 0);
      const totalTransactions = transactions.reduce((sum, day) => sum + day.count, 0);

      return {
        transactions,
        totalEarnings,
        totalTransactions,
        startDate,
        endDate
      };
    } catch (error) {
      logger.error(`Failed to generate earnings report for trader ${traderId}:`, error);
      throw error;
    }
  },

  getDateFilter(period) {
    const now = new Date();
    const filter = {};

    switch (period) {
      case 'day':
        filter.$gte = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        filter.$gte = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        filter.$gte = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        filter.$gte = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        filter.$gte = new Date(now.setMonth(now.getMonth() - 1));
    }

    return filter;
  },

  async calculatePerformanceMetrics(traderId, dateFilter) {
    const [completed, disputed] = await Promise.all([
      Transaction.countDocuments({
        trader: traderId,
        status: 'completed',
        createdAt: dateFilter
      }),
      Transaction.countDocuments({
        trader: traderId,
        status: 'disputed',
        createdAt: dateFilter
      })
    ]);

    const total = completed + disputed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const disputeRate = total > 0 ? (disputed / total) * 100 : 0;

    return {
      completionRate,
      disputeRate,
      totalTransactions: total
    };
  }
};
