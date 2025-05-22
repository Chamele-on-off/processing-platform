const Transaction = require('../../../common/models/transaction.model');
const Order = require('../../../common/models/order.model');
const Balance = require('../../../common/models/balance.model');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getTransactionHistory(merchantId, filters = {}, pagination = {}) {
    try {
      const { type, status, startDate, endDate } = filters;
      const { page = 1, limit = 20 } = pagination;

      const query = { merchant: merchantId };
      if (type) query.type = type;
      if (status) query.status = status;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const [transactions, total] = await Promise.all([
        Transaction.find(query)
          .populate('trader', 'name rating')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        Transaction.countDocuments(query)
      ]);

      return {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error(`Failed to get transaction history for merchant ${merchantId}:`, error);
      throw error;
    }
  },

  async getTransactionDetails(transactionId, merchantId) {
    try {
      const transaction = await Transaction.findOne({
        _id: transactionId,
        merchant: merchantId
      })
        .populate('trader', 'name rating')
        .populate('order');

      if (!transaction) {
        throw new Error('Transaction not found or access denied');
      }

      return transaction;
    } catch (error) {
      logger.error(`Failed to get transaction ${transactionId}:`, error);
      throw error;
    }
  },

  async disputeTransaction(transactionId, merchantId, reason, evidence) {
    try {
      const transaction = await Transaction.findOneAndUpdate(
        {
          _id: transactionId,
          merchant: merchantId,
          status: { $in: ['completed', 'processing'] }
        },
        {
          status: 'disputed',
          disputeReason: reason,
          disputeEvidence: evidence,
          disputedAt: new Date()
        },
        { new: true }
      );

      if (!transaction) {
        throw new Error('Transaction not found or cannot be disputed');
      }

      // Обновить связанный ордер
      await Order.findByIdAndUpdate(
        transaction.order,
        { status: 'disputed' }
      );

      return transaction;
    } catch (error) {
      logger.error(`Failed to dispute transaction ${transactionId}:`, error);
      throw error;
    }
  },

  async getCurrentBalance(merchantId) {
    try {
      const balance = await Balance.findOne({ merchant: merchantId });
      if (!balance) {
        return { available: 0, pending: 0, currency: 'RUB' };
      }
      return balance;
    } catch (error) {
      logger.error(`Failed to get balance for merchant ${merchantId}:`, error);
      throw error;
    }
  },

  async getBalanceHistory(merchantId, filters = {}, pagination = {}) {
    try {
      const { startDate, endDate } = filters;
      const { page = 1, limit = 30 } = pagination;

      const query = { merchant: merchantId };
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const [history, total] = await Promise.all([
        Transaction.find(query)
          .select('amount type status createdAt')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        Transaction.countDocuments(query)
      ]);

      return {
        history,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error(`Failed to get balance history for merchant ${merchantId}:`, error);
      throw error;
    }
  },

  async requestWithdrawal(merchantId, amount, destination) {
    try {
      const balance = await Balance.findOne({ merchant: merchantId });
      if (!balance || balance.available < amount) {
        throw new Error('Insufficient balance for withdrawal');
      }

      // Создаем запрос на вывод
      const withdrawal = new Transaction({
        merchant: merchantId,
        type: 'withdrawal',
        amount,
        destination,
        status: 'pending'
      });

      await withdrawal.save();

      // Резервируем средства
      balance.available -= amount;
      balance.pendingWithdrawal += amount;
      await balance.save();

      return withdrawal;
    } catch (error) {
      logger.error(`Failed to request withdrawal for merchant ${merchantId}:`, error);
      throw error;
    }
  }
};
