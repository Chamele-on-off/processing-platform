const Transaction = require('../../../common/models/transaction.model');
const Order = require('../../../common/models/order.model');
const User = require('../../../common/models/user.model');
const { calculateTimeDifference } = require('../../../common/utils/helpers');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getPlatformStats() {
    try {
      const [transactions, orders, users] = await Promise.all([
        Transaction.aggregate([
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
              avgAmount: { $avg: "$amount" },
              completedCount: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
              },
              disputedCount: {
                $sum: { $cond: [{ $eq: ["$status", "disputed"] }, 1, 0] }
              }
            }
          }
        ]),
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              pendingCount: {
                $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
              },
              processingCount: {
                $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] }
              }
            }
          }
        ]),
        User.aggregate([
          {
            $group: {
              _id: null,
              totalUsers: { $sum: 1 },
              activeTraders: {
                $sum: { $cond: [{ $and: [{ $eq: ["$role", "trader"] }, { $eq: ["$status", "active"] }] }, 1, 0] }
              },
              activeMerchants: {
                $sum: { $cond: [{ $and: [{ $eq: ["$role", "merchant"] }, { $eq: ["$status", "active"] }] }, 1, 0] }
              }
            }
          }
        ])
      ]);

      return {
        transactions: transactions[0] || {},
        orders: orders[0] || {},
        users: users[0] || {},
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Failed to calculate platform stats:', error);
      throw error;
    }
  },

  async getTraderStats(traderId) {
    try {
      const [transactions, performance] = await Promise.all([
        Transaction.aggregate([
          { $match: { trader: traderId } },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              totalAmount: { $sum: "$amount" }
            }
          }
        ]),
        this.calculateTraderPerformance(traderId)
      ]);

      return {
        transactions,
        performance,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error(`Failed to get stats for trader ${traderId}:`, error);
      throw error;
    }
  },

  async calculateTraderPerformance(traderId) {
    const completedTransactions = await Transaction.find({
      trader: traderId,
      status: 'completed'
    }).sort({ completedAt: 1 });

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
      disputeRate
    };
  },

  async getMerchantStats(merchantId) {
    try {
      const [orders, transactions] = await Promise.all([
        Order.aggregate([
          { $match: { merchant: merchantId } },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              totalAmount: { $sum: "$amount" }
            }
          }
        ]),
        Transaction.aggregate([
          { $match: { merchant: merchantId } },
          {
            $group: {
              _id: "$type",
              count: { $sum: 1 },
              totalAmount: { $sum: "$amount" }
            }
          }
        ])
      ]);

      return {
        orders,
        transactions,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error(`Failed to get stats for merchant ${merchantId}:`, error);
      throw error;
    }
  }
};
