const disputeService = require('../services/dispute-resolution.service');
const { successResponse, errorResponse } = require('../../../common/utils/api-response');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getDisputes(req, res) {
    try {
      const { traderId } = req.user;
      const { status } = req.query;

      const disputes = await disputeService.getTraderDisputes(traderId, status);
      successResponse(res, 'Disputes retrieved', disputes);
    } catch (error) {
      logger.error('Failed to get disputes:', error);
      errorResponse(res, 'Failed to retrieve disputes', error);
    }
  },

  async getDisputeDetails(req, res) {
    try {
      const { disputeId } = req.params;
      const { traderId } = req.user;

      const dispute = await disputeService.getDisputeDetails(disputeId, traderId);
      successResponse(res, 'Dispute details retrieved', dispute);
    } catch (error) {
      logger.error(`Failed to get dispute ${disputeId}:`, error);
      errorResponse(res, 'Failed to retrieve dispute details', error);
    }
  },

  async createDispute(req, res) {
    try {
      const { traderId } = req.user;
      const { orderId, reason, evidence } = req.body;

      const dispute = await disputeService.createDispute(orderId, traderId, reason, evidence);
      successResponse(res, 'Dispute created successfully', dispute, 201);
    } catch (error) {
      logger.error('Failed to create dispute:', error);
      errorResponse(res, 'Failed to create dispute', error);
    }
  },

  async addDisputeEvidence(req, res) {
    try {
      const { disputeId } = req.params;
      const { traderId } = req.user;
      const { evidence } = req.body;

      const dispute = await disputeService.addDisputeEvidence(disputeId, traderId, evidence);
      successResponse(res, 'Evidence added to dispute', dispute);
    } catch (error) {
      logger.error(`Failed to add evidence to dispute ${disputeId}:`, error);
      errorResponse(res, 'Failed to add dispute evidence', error);
    }
  }
};
