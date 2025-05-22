const orderService = require('../services/order-processing.service');
const { successResponse, errorResponse } = require('../../../common/utils/api-response');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getActiveOrders(req, res) {
    try {
      const { traderId } = req.user;
      const { type, minAmount, maxAmount } = req.query;

      const orders = await orderService.getActiveOrders(traderId, {
        type,
        minAmount: parseFloat(minAmount),
        maxAmount: parseFloat(maxAmount)
      });

      successResponse(res, 'Active orders retrieved', orders);
    } catch (error) {
      logger.error('Failed to get active orders:', error);
      errorResponse(res, 'Failed to retrieve active orders', error);
    }
  },

  async acceptOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { traderId } = req.user;

      const order = await orderService.acceptOrder(orderId, traderId);
      successResponse(res, 'Order accepted successfully', order);
    } catch (error) {
      logger.error(`Failed to accept order ${orderId}:`, error);
      errorResponse(res, 'Failed to accept order', error);
    }
  },

  async rejectOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { traderId } = req.user;
      const { reason } = req.body;

      const order = await orderService.rejectOrder(orderId, traderId, reason);
      successResponse(res, 'Order rejected successfully', order);
    } catch (error) {
      logger.error(`Failed to reject order ${orderId}:`, error);
      errorResponse(res, 'Failed to reject order', error);
    }
  },

  async completeOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { traderId } = req.user;
      const { proofUrl } = req.body;

      const order = await orderService.completeOrder(orderId, traderId, proofUrl);
      successResponse(res, 'Order completed successfully', order);
    } catch (error) {
      logger.error(`Failed to complete order ${orderId}:`, error);
      errorResponse(res, 'Failed to complete order', error);
    }
  }
};
