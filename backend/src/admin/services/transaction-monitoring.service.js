const Transaction = require('../../../common/models/transaction.model');
const Order = require('../../../common/models/order.model');
const { detectAnomalies } = require('../../../common/antifraud/fraud-detection.service');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getTransactions(filters) {
    try {
      const { type, status, merchantId, traderId, dateFrom, dateTo, page = 1, limit = 50 } = filters;

      const query = {};
      if (type) query.type = type;
      if (status) query.status = status;
      if (merchantId) query.merchant = merchantId;
      if (traderId) query.trader = traderId;
      
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      const [transactions, total] = await Promise.all([
        Transaction.find(query)
          .populate('merchant', 'name email')
          .populate('trader', 'name email')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        Transaction.countDocuments(query)
      ]);

      return {
        transactions,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Failed to get transactions:', error);
      throw error;
    }
  },

  async flagTransaction(transactionId, reason, adminId) {
    try {
      const transaction = await Transaction.findByIdAndUpdate(
        transactionId,
        {
          isFlagged: true,
          flagReason: reason,
          flaggedAt: new Date(),
          flaggedBy: adminId
        },
        { new: true }
      );

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Проверить на аномалии
      const anomalies = await detectAnomalies(transaction);
      if (anomalies.length > 0) {
        await this.handleAnomalies(transaction, anomalies);
      }

      return transaction;
    } catch (error) {
      logger.error(`Failed to flag transaction ${transactionId}:`, error);
      throw error;
    }
  },

  async handleAnomalies(transaction, anomalies) {
    // Логирование аномалий
    logger.warn(`Anomalies detected in transaction ${transaction._id}:`, anomalies);
    
    // Автоматические действия в зависимости от типа аномалии
    if (anomalies.includes('unusual_amount')) {
      // Заморозить связанные средства
    }

    if (anomalies.includes('suspicious_trader_behavior')) {
      // Уведомить администрацию о трейдере
    }
  },

  async resolveDispute(transactionId, resolution, resolvedAmount, adminId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status !== 'disputed') {
        throw new Error('Transaction is not in disputed state');
      }

      transaction.status = 'resolved';
      transaction.disputeResolution = resolution;
      transaction.resolvedAmount = resolvedAmount;
      transaction.resolvedBy = adminId;
      transaction.resolvedAt = new Date();

      await transaction.save();

      // Обновить связанный ордер
      if (transaction.order) {
        await Order.findByIdAndUpdate(transaction.order, {
          status: 'completed',
          disputeResolved: true
        });
      }

      return transaction;
    } catch (error) {
      logger.error(`Failed to resolve dispute for transaction ${transactionId}:`, error);
      throw error;
    }
  }
};
