const Order = require('../../../common/models/order.model');
const Transaction = require('../../../common/models/transaction.model');
const { checkTraderLimits } = require('../../../common/antifraud/rules/transaction-patterns.rule');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getActiveOrders(traderId, filters = {}) {
    try {
      const query = {
        status: 'active',
        assignedTrader: traderId
      };

      if (filters.type) {
        query.type = filters.type;
      }

      if (filters.minAmount || filters.maxAmount) {
        query.amount = {};
        if (filters.minAmount) query.amount.$gte = filters.minAmount;
        if (filters.maxAmount) query.amount.$lte = filters.maxAmount;
      }

      return Order.find(query)
        .populate('merchant', 'name email')
        .sort({ priority: -1, createdAt: 1 });
    } catch (error) {
      logger.error(`Failed to get active orders for trader ${traderId}:`, error);
      throw error;
    }
  },

  async acceptOrder(orderId, traderId) {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.assignedTrader.toString() !== traderId) {
        throw new Error('Order not assigned to this trader');
      }

      if (order.status !== 'active') {
        throw new Error('Order is not in active state');
      }

      // Проверка лимитов трейдера
      await checkTraderLimits(traderId, order.amount);

      order.status = 'processing';
      order.processingStartedAt = new Date();
      await order.save();

      // Создание транзакции
      const transaction = new Transaction({
        order: order._id,
        merchant: order.merchant,
        trader: traderId,
        amount: order.amount,
        currency: order.currency,
        type: order.type,
        status: 'processing'
      });

      await transaction.save();

      return {
        order,
        transaction
      };
    } catch (error) {
      logger.error(`Failed to accept order ${orderId}:`, error);
      throw error;
    }
  },

  async rejectOrder(orderId, traderId, reason) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status: 'rejected',
          rejectedBy: traderId,
          rejectedAt: new Date(),
          rejectionReason: reason
        },
        { new: true }
      );

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      logger.error(`Failed to reject order ${orderId}:`, error);
      throw error;
    }
  },

  async completeOrder(orderId, traderId, proofUrl) {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'processing') {
        throw new Error('Order is not in processing state');
      }

      if (order.processingStartedBy.toString() !== traderId) {
        throw new Error('Order not processed by this trader');
      }

      // Обновление ордера
      order.status = 'completed';
      order.completedAt = new Date();
      order.proofUrl = proofUrl;
      await order.save();

      // Обновление транзакции
      const transaction = await Transaction.findOneAndUpdate(
        { order: orderId },
        {
          status: 'completed',
          completedAt: new Date(),
          proofUrl
        },
        { new: true }
      );

      return {
        order,
        transaction
      };
    } catch (error) {
      logger.error(`Failed to complete order ${orderId}:`, error);
      throw error;
    }
  }
};
