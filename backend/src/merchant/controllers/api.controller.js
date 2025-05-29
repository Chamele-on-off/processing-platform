const requisitesService = require('../../common/services/requisites.service');
const { successResponse, errorResponse } = require('../../common/utils/api-response');
const logger = require('../../common/utils/logger');

module.exports = {
  async getPaymentRequisite(req, res) {
    try {
      const { merchantId } = req.user;
      const { amount, currency, paymentMethod } = req.body;

      if (!['bank_account', 'card', 'crypto'].includes(paymentMethod)) {
        return errorResponse(res, 'Invalid payment method', null, 400);
      }

      const requisite = await requisitesService.getAvailableRequisite(
        merchantId,
        amount,
        currency
      );

      successResponse(res, 'Requisite provided', requisite);
    } catch (error) {
      logger.error('Failed to get payment requisite:', error);
      errorResponse(res, 'Failed to get payment details', error);
    }
  },

  async confirmPayment(req, res) {
    try {
      const { merchantId } = req.user;
      const { reservationKey, clientData } = req.body;

      const order = await requisitesService.createOrderFromReservation(
        reservationKey,
        clientData
      );

      successResponse(res, 'Payment confirmed', order);
    } catch (error) {
      logger.error('Payment confirmation failed:', error);
      errorResponse(res, 'Payment confirmation failed', error);
    }
  }
};
