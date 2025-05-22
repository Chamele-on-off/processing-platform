const transactionService = require('../services/merchant-transactions.service');
const { successResponse, errorResponse } = require('../../../common/utils/api-response');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getTransactionHistory(req, res) {
    try {
      const { merchantId } = req.user;
      const { type, status, startDate, endDate, page = 1, limit = 20 } = req.query;

      const transactions = await transactionService.getTransactionHistory(
        merchantId,
        { type, status, startDate, endDate },
        { page: parseInt(page), limit: parseInt(limit) }
      );

      successResponse(res, 'Transaction history retrieved', transactions);
    } catch (error) {
      logger.error('Failed to get transaction history:', error);
      errorResponse(res, 'Failed to retrieve transaction history', error);
    }
  },

  async getTransactionDetails(req, res) {
    try {
      const { merchantId } = req.user;
      const { transactionId } = req.params;

      const transaction = await transactionService.getTransactionDetails(
        transactionId,
        merchantId
      );

      successResponse(res, 'Transaction details retrieved', transaction);
    } catch (error) {
      logger.error(`Failed to get transaction ${transactionId}:`, error);
      errorResponse(res, 'Failed to retrieve transaction details', error);
    }
  },

  async disputeTransaction(req, res) {
    try {
      const { merchantId } = req.user;
      const { transactionId } = req.params;
      const { reason, evidence } = req.body;

      const dispute = await transactionService.disputeTransaction(
        transactionId,
        merchantId,
        reason,
        evidence
      );

      successResponse(res, 'Transaction disputed successfully', dispute);
    } catch (error) {
      logger.error(`Failed to dispute transaction ${transactionId}:`, error);
      errorResponse(res, 'Failed to dispute transaction', error);
    }
  }
};
