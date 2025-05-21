const Transaction = require('../../common/models/transaction.model');
const Order = require('../../common/models/order.model');
const { successResponse, errorResponse } = require('../../common/utils/api-response');
const logger = require('../../common/utils/logger');

exports.getAllTransactions = async (req, res) => {
  try {
    const { type, status, merchantId, traderId, dateFrom, dateTo } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (merchantId) filter.merchant = merchantId;
    if (traderId) filter.trader = traderId;
    
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const transactions = await Transaction.find(filter)
      .populate('merchant', 'name email')
      .populate('trader', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    successResponse(res, 'Transactions retrieved successfully', {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Failed to get transactions:', error);
    errorResponse(res, 'Failed to retrieve transactions', error);
  }
};

exports.getTransactionDetails = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('merchant', 'name email')
      .populate('trader', 'name email')
      .populate('order');

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', null, 404);
    }

    successResponse(res, 'Transaction details retrieved', transaction);
  } catch (error) {
    logger.error(`Failed to get transaction ${req.params.id}:`, error);
    errorResponse(res, 'Failed to retrieve transaction details', error);
  }
};

exports.flagTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { flagReason } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { 
        isFlagged: true,
        flagReason,
        flaggedAt: new Date(),
        flaggedBy: req.user.id
      },
      { new: true }
    );

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', null, 404);
    }

    // Дополнительные действия для подозрительных транзакций
    if (transaction.trader) {
      // Проверить трейдера на фрод
    }

    successResponse(res, 'Transaction flagged successfully', transaction);
  } catch (error) {
    logger.error(`Failed to flag transaction ${id}:`, error);
    errorResponse(res, 'Failed to flag transaction', error);
  }
};

exports.resolveDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution, resolvedAmount } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return errorResponse(res, 'Transaction not found', null, 404);
    }

    if (transaction.status !== 'disputed') {
      return errorResponse(res, 'Transaction is not in disputed state', null, 400);
    }

    transaction.status = 'resolved';
    transaction.disputeResolution = resolution;
    transaction.resolvedAmount = resolvedAmount;
    transaction.resolvedBy = req.user.id;
    transaction.resolvedAt = new Date();

    await transaction.save();

    // Обновить связанный ордер если нужно
    if (transaction.order) {
      await Order.findByIdAndUpdate(transaction.order, {
        status: 'completed',
        disputeResolved: true
      });
    }

    successResponse(res, 'Dispute resolved successfully', transaction);
  } catch (error) {
    logger.error(`Failed to resolve dispute ${id}:`, error);
    errorResponse(res, 'Failed to resolve dispute', error);
  }
};
