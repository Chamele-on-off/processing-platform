const User = require('../models/user.model');
const Order = require('../models/order.model');
const logger = require('../utils/logger');

class PriorityCalculationService {
  async calculateOrderPriority(order) {
    try {
      let priority = 1; // Base priority

      // Amount factor (higher amount = higher priority)
      if (order.amount > 50000) priority += 2;
      else if (order.amount > 10000) priority += 1;

      // Merchant factor (VIP merchants get higher priority)
      const merchant = await User.findById(order.merchant);
      if (merchant?.merchantDetails?.isVip) {
        priority += 1;
      }

      // Time factor (older orders get higher priority)
      const ageInHours = (new Date() - order.createdAt) / (1000 * 60 * 60);
      if (ageInHours > 2) priority += 1;
      if (ageInHours > 4) priority += 1;

      // Ensure priority is within bounds
      return Math.min(Math.max(priority, 1), 5);
    } catch (error) {
      logger.error('Priority calculation failed:', error);
      return 3; // Default priority
    }
  }

  async calculateTraderPriority(traderId, order) {
    try {
      const trader = await User.findById(traderId);
      if (!trader) {
        throw new Error('Trader not found');
      }

      let priority = 3; // Base priority

      // Rating factor
      priority += trader.traderDetails.rating - 3; // Adjust based on rating (0-5 scale)

      // Conversion rate factor
      const conversionRate = trader.traderDetails.conversionRate / 100;
      priority += conversionRate > 0.8 ? 1 : 0;
      priority += conversionRate < 0.5 ? -1 : 0;

      // Specialization factor (if trader specializes in this order type)
      if (trader.traderDetails.specialization === order.type) {
        priority += 1;
      }

      // Current workload factor
      const activeOrders = await Order.countDocuments({
        trader: traderId,
        status: { $in: ['processing', 'pending'] }
      });
      if (activeOrders > 5) priority -= 1;
      if (activeOrders > 10) priority -= 1;

      // Ensure priority is within bounds
      return Math.min(Math.max(priority, 1), 5);
    } catch (error) {
      logger.error('Trader priority calculation failed:', error);
      return 3; // Default priority
    }
  }
}

module.exports = new PriorityCalculationService();
