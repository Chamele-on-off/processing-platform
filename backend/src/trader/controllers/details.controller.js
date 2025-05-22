const detailsService = require('../services/payment-details.service');
const { successResponse, errorResponse } = require('../../../common/utils/api-response');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getPaymentDetails(req, res) {
    try {
      const { traderId } = req.user;
      const details = await detailsService.getPaymentDetails(traderId);
      successResponse(res, 'Payment details retrieved', details);
    } catch (error) {
      logger.error('Failed to get payment details:', error);
      errorResponse(res, 'Failed to retrieve payment details', error);
    }
  },

  async addPaymentDetail(req, res) {
    try {
      const { traderId } = req.user;
      const detailData = req.body;

      const detail = await detailsService.addPaymentDetail(traderId, detailData);
      successResponse(res, 'Payment detail added', detail, 201);
    } catch (error) {
      logger.error('Failed to add payment detail:', error);
      errorResponse(res, 'Failed to add payment detail', error);
    }
  },

  async updatePaymentDetail(req, res) {
    try {
      const { traderId } = req.user;
      const { detailId } = req.params;
      const updates = req.body;

      const detail = await detailsService.updatePaymentDetail(traderId, detailId, updates);
      successResponse(res, 'Payment detail updated', detail);
    } catch (error) {
      logger.error(`Failed to update payment detail ${detailId}:`, error);
      errorResponse(res, 'Failed to update payment detail', error);
    }
  },

  async deletePaymentDetail(req, res) {
    try {
      const { traderId } = req.user;
      const { detailId } = req.params;

      await detailsService.deletePaymentDetail(traderId, detailId);
      successResponse(res, 'Payment detail deleted');
    } catch (error) {
      logger.error(`Failed to delete payment detail ${detailId}:`, error);
      errorResponse(res, 'Failed to delete payment detail', error);
    }
  }
};
