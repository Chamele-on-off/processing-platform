const PaymentDetail = require('../../../common/models/payment-detail.model');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getPaymentDetails(traderId) {
    try {
      return PaymentDetail.find({ trader: traderId, isActive: true })
        .sort({ createdAt: -1 });
    } catch (error) {
      logger.error(`Failed to get payment details for trader ${traderId}:`, error);
      throw error;
    }
  },

  async addPaymentDetail(traderId, detailData) {
    try {
      const paymentDetail = new PaymentDetail({
        ...detailData,
        trader: traderId,
        isActive: true
      });

      await paymentDetail.save();
      return paymentDetail;
    } catch (error) {
      logger.error(`Failed to add payment detail for trader ${traderId}:`, error);
      throw error;
    }
  },

  async updatePaymentDetail(traderId, detailId, updates) {
    try {
      const paymentDetail = await PaymentDetail.findOneAndUpdate(
        { _id: detailId, trader: traderId },
        updates,
        { new: true }
      );

      if (!paymentDetail) {
        throw new Error('Payment detail not found or not owned by trader');
      }

      return paymentDetail;
    } catch (error) {
      logger.error(`Failed to update payment detail ${detailId}:`, error);
      throw error;
    }
  },

  async deletePaymentDetail(traderId, detailId) {
    try {
      const result = await PaymentDetail.findOneAndDelete({
        _id: detailId,
        trader: traderId
      });

      if (!result) {
        throw new Error('Payment detail not found or not owned by trader');
      }

      return result;
    } catch (error) {
      logger.error(`Failed to delete payment detail ${detailId}:`, error);
      throw error;
    }
  }
};
