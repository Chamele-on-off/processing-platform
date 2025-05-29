const Transaction = require('../../common/models/transaction.model');
const Order = require('../../common/models/order.model');
const User = require('../../common/models/user.model');
const logger = require('../../common/utils/logger');
const redis = require('../../common/config/redis');

class MonitoringService {
  async getRealTimeStats() {
    try {
      const [transactions, orders, users] = await Promise.all([
        Transaction.aggregate([
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
              completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
              totalAmount: { $sum: "$amount" }
            }
          }
        ]),
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
              processingCount: { $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] } }
            }
          }
        ]),
        User.aggregate([
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
              active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } }
            }
          }
        ])
      ]);

      return {
        transactions: transactions[0] || {},
        orders: orders[0] || {},
        users: this.formatUserStats(users),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Real-time stats failed:', error);
      throw error;
    }
  }

  formatUserStats(userGroups) {
    const result = {};
    userGroups.forEach(group => {
      result[group._id] = {
        total: group.count,
        active: group.active
      };
    });
    return result;
  }

  async getActiveAlerts() {
    try {
      const alerts = await redis.keys('alert:*');
      if (alerts.length === 0) {
        return [];
      }

      const alertData = await redis.mget(alerts);
      return alertData.map(JSON.parse);
    } catch (error) {
      logger.error('Failed to get active alerts:', error);
      return [];
    }
  }

  async createAlert(type, message, severity = 'medium') {
    try {
      const alert = {
        id: `alert:${Date.now()}`,
        type,
        message,
        severity,
        createdAt: new Date()
      };

      await redis.set(alert.id, JSON.stringify(alert), 'EX', 86400; // 24 hours
      return alert;
    } catch (error) {
      logger.error('Alert creation failed:', error);
      throw error;
    }
  }
}

module.exports = new MonitoringService();
