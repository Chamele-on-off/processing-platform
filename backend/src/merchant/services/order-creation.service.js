const Order = require('../../../common/models/order.model');
const Transaction = require('../../../common/models/transaction.model');
const { assignToTrader } = require('../../../common/services/order-assignment.service');
const logger = require('../../../common/utils/logger');

module.exports = {
  async createDepositOrder(merchantId, amount, paymentDetails) {
    try {
      const order = new Order({
        merchant: merchantId,
        type: 'deposit',
        amount,
        paymentDetails,
        status: 'pending',
        priority: this.calculatePriority(amount)
      });

      await order.save();

      // Попытка автоматического назначения трейдера
      await assignToTrader(order);

      return order;
    } catch (error) {
      logger.error(`Failed to create deposit order for merchant ${merchantId}:`, error);
      throw error;
    }
  },

  async createWithdrawalOrder(merchantId, amount, destination) {
    try {
      // Проверка достаточности баланса (должна быть в другом сервисе)
      const order = new Order({
        merchant: merchantId,
        type: 'withdrawal',
        amount,
        destination,
        status: 'pending',
        priority: this.calculatePriority(amount)
      });

      await order.save();

      // Попытка автоматического назначения трейдера
      await assignToTrader(order);

      return order;
    } catch (error) {
      logger.error(`Failed to create withdrawal order for merchant ${merchantId}:`, error);
      throw error;
    }
  },

  async getOrderHistory(merchantId, filters = {}) {
    try {
      const { status, type, page, limit } = filters;
      
      const query = { merchant: merchantId };
      if (status) query.status = status;
      if (type) query.type = type;

      const [orders, total] = await Promise.all([
        Order.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        Order.countDocuments(query)
      ]);

      return {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error(`Failed to get order history for merchant ${merchantId}:`, error);
      throw error;
    }
  },

  async cancelOrder(orderId, merchantId) {
    try {
      const order = await Order.findOneAndUpdate(
        { _id: orderId, merchant: merchantId, status: 'pending' },
        { status: 'cancelled', cancelledAt: new Date() },
        { new: true }
      );

      if (!order) {
        throw new Error('Order not found or cannot be cancelled');
      }

      // Отменить связанную транзакцию, если есть
      await Transaction.updateOne(
        { order: orderId },
        { status: 'cancelled' }
      );

      return order;
    } catch (error) {
      logger.error(`Failed to cancel order ${orderId}:`, error);
      throw error;
    }
  },

  calculatePriority(amount) {
    // Логика расчета приоритета на основе суммы и других факторов
    if (amount > 50000) return 5; // Высокий приоритет для крупных сумм
    if (amount > 10000) return 3;
    return 1; // Низкий приоритет по умолчанию
  }
};
