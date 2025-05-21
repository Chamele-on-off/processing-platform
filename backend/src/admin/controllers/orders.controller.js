const orderService = require('../services/order-processing.service');
const { successResponse, errorResponse } = require('../../../common/utils/api-response');

exports.getActiveOrders = async (req, res) => {
  try {
    const { traderId } = req.user;
    const orders = await orderService.getActiveOrders(traderId);
    successResponse(res, 'Active orders retrieved', orders);
  } catch (error) {
    errorResponse(res, 'Failed to get active orders', error);
  }
};

exports.processOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { traderId } = req.user;
    const result = await orderService.processOrder(orderId, traderId);
    successResponse(res, 'Order processed successfully', result);
  } catch (error) {
    errorResponse(res, 'Failed to process order', error);
  }
};
