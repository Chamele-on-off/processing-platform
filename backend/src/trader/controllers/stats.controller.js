const statsService = require('../services/trader-analytics.service');
const { successResponse, errorResponse } = require('../../../common/utils/api-response');
const logger = require('../../../common/utils/logger');

module.exports = {
  async getTraderStats(req, res) {
    try {
      const { traderId } = req.user;
      const { period } = req.query; // day, week, month, year

      const stats = await statsService.getTraderStatistics(traderId, period);
      successResponse(res, 'Trader statistics retrieved', stats);
    } catch (error) {
      logger.error('Failed to get trader stats:', error);
      errorResponse(res, 'Failed to retrieve trader statistics', error);
    }
  },

  async getPerformanceMetrics(req, res) {
    try {
      const { traderId } = req.user;
      const metrics = await statsService.getPerformanceMetrics(traderId);
      successResponse(res, 'Performance metrics retrieved', metrics);
    } catch (error) {
      logger.error('Failed to get performance metrics:', error);
      errorResponse(res, 'Failed to retrieve performance metrics', error);
    }
  },

  async getEarningsReport(req, res) {
    try {
      const { traderId } = req.user;
      const { startDate, endDate } = req.query;

      const report = await statsService.getEarningsReport(
        traderId,
        new Date(startDate),
        new Date(endDate)
      );

      successResponse(res, 'Earnings report generated', report);
    } catch (error) {
      logger.error('Failed to generate earnings report:', error);
      errorResponse(res, 'Failed to generate earnings report', error);
    }
  }
};
