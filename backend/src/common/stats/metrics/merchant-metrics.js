const Order = require('../../models/order.model');
const Transaction = require('../../models/transaction.model');

module.exports = {
  async getPlatformWideMetrics() {
    const [orderStats, transactionStats] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
            },
            completedOrders: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
            },
            totalVolume: { $sum: "$amount" }
          }
        }
      ]),
      Transaction.aggregate([
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
      ...orderStats[0],
      transactionsByType: transactionStats
    };
  },

  async getMerchantMetrics(merchantId) {
    const [orders, transactions, balanceStats] = await Promise.all([
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
      ]),
      this.calculateBalanceStats(merchantId)
    ]);

    return {
      orders,
      transactions,
      balance: balanceStats,
      lastUpdated: new Date()
    };
  },

  async calculateBalanceStats(merchantId) {
    const [deposits, withdrawals] = await Promise.all([
      Transaction.aggregate([
        { 
          $match: { 
            merchant: merchantId,
            type: 'deposit',
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]),
      Transaction.aggregate([
        { 
          $match: { 
            merchant: merchantId,
            type: 'withdrawal',
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    return {
      totalDeposits: deposits[0]?.total || 0,
      depositCount: deposits[0]?.count || 0,
      totalWithdrawals: withdrawals[0]?.total || 0,
      withdrawalCount: withdrawals[0]?.count || 0
    };
  }
};
