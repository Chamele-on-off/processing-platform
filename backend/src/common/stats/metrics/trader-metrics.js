const Transaction = require('../../models/transaction.model');
const Order = require('../../models/order.model');
const { calculateTimeDifference } = require('../../utils/helpers');

module.exports = {
  async getPlatformWideMetrics() {
    const [transactionStats, performanceStats] = await Promise.all([
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            completedTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
            },
            disputedTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "disputed"] }, 1, 0] }
            },
            totalVolume: { $sum: "$amount" }
          }
        }
      ]),
      this.calculateAveragePerformance()
    ]);

    return {
      ...transactionStats[0],
      ...performanceStats
    };
  },

  async getTraderMetrics(traderId) {
    const [transactions, orders, performance] = await Promise.all([
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
      Order.aggregate([
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
      orders,
      performance,
      lastUpdated: new Date()
    };
  },

  async calculateAveragePerformance() {
    const completedTransactions = await Transaction.find({
      status: 'completed'
    }).select('processingStartedAt completedAt');

    const processingTimes = completedTransactions.map(tx => 
      calculateTimeDifference(tx.processingStartedAt, tx.completedAt)
    );

    const avgProcessingTime = processingTimes.length > 0 
      ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
      : 0;

    return {
      avgProcessingTime,
      avgCompletionRate: await this.calculateAverageCompletionRate()
    };
  },

  async calculateTraderPerformance(traderId) {
    const [completed, disputed] = await Promise.all([
      Transaction.countDocuments({ trader: traderId, status: 'completed' }),
      Transaction.countDocuments({ trader: traderId, status: 'disputed' })
    ]);

    const total = completed + disputed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const disputeRate = total > 0 ? (disputed / total) * 100 : 0;

    return {
      completionRate,
      disputeRate,
      totalTransactions: total
    };
  },

  async calculateAverageCompletionRate() {
    const [completed, disputed] = await Promise.all([
      Transaction.countDocuments({ status: 'completed' }),
      Transaction.countDocuments({ status: 'disputed' })
    ]);

    const total = completed + disputed;
    return total > 0 ? (completed / total) * 100 : 0;
  }
};
