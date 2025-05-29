const logger = require('../utils/logger');
const User = require('../models/user.model');

class FeeCalculationService {
  async calculateFee(userId, amount, transactionType) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      let feeRate;
      if (user.role === 'merchant') {
        feeRate = user.merchantDetails.processingRates[transactionType] || 0.05;
      } else {
        // Default rates if not specified
        feeRate = transactionType === 'deposit' ? 0.03 : 0.02;
      }

      const fee = amount * feeRate;
      const netAmount = amount - fee;

      return {
        feeRate,
        fee,
        netAmount,
        currency: 'USD' // Default, should be adjusted per transaction
      };
    } catch (error) {
      logger.error('Fee calculation failed:', error);
      throw error;
    }
  }

  async calculatePlatformProfit(startDate, endDate) {
    try {
      const result = await Transaction.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalFee: { $sum: "$fee" },
            depositCount: { $sum: { $cond: [{ $eq: ["$type", "deposit"] }, 1, 0] } },
            withdrawalCount: { $sum: { $cond: [{ $eq: ["$type", "withdrawal"] }, 1, 0] } }
          }
        }
      ]);

      return result[0] || {
        totalAmount: 0,
        totalFee: 0,
        depositCount: 0,
        withdrawalCount: 0
      };
    } catch (error) {
      logger.error('Profit calculation failed:', error);
      throw error;
    }
  }
}

module.exports = new FeeCalculationService();
