const orderService = require('../services/order-creation.service');
const { successResponse, errorResponse } = require('../../../common/utils/api-response');
const logger = require('../../../common/utils/logger');

module.exports = {
  async createDepositOrder(req, res) {
    try {
      const { merchantId } = req.user;
      const { amount, paymentDetails } = req.body;

      const order = await orderService.createDepositOrder(merchantId, amount, paymentDetails);
      successResponse(res, 'Deposit order created successfully', order, 201);
    } catch (error) {
      logger.error('Failed to create deposit order:', error);
      errorResponse(res, 'Failed to create deposit order', error);
    }
  },

  async createWithdrawalOrder(req, res) {
    try {
      const { merchantId } = req.user;
      const { amount, destination } = req.body;

      const order = await orderService.createWithdrawalOrder(merchantId, amount, destination);
      successResponse(res, 'Withdrawal order created successfully', order, 201);
    } catch (error) {
      logger.error('Failed to create withdrawal order:', error);
      errorResponse(res, 'Failed to create withdrawal order', error);
    }
  },

  async getOrderHistory(req, res) {
    try {
      const { merchantId } = req.user;
      const { status, type, page = 1, limit = 20 } = req.query;

      const orders = await orderService.getOrderHistory(merchantId, {
        status,
        type,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      successResponse(res, 'Order history retrieved', orders);
    } catch (error) {
      logger.error('Failed to get order history:', error);
      errorResponse(res, 'Failed to retrieve order history', error);
    }
  },

  async cancelOrder(req, res) {
    try {
      const { merchantId } = req.user;
      const { orderId } = req.params;

      const order = await orderService.cancelOrder(orderId, merchantId);
      successResponse(res, 'Order cancelled successfully', order);
    } catch (error) {
      logger.error(`Failed to cancel order ${orderId}:`, error);
      errorResponse(res, 'Failed to cancel order', error);
    }
  }
};
