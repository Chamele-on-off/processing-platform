const statsService = require('../services/stats.service');
const { successResponse, errorResponse } = require('../../../common/utils/api-response');

exports.getPlatformStats = async (req, res) => {
  try {
    const stats = await statsService.getPlatformStats();
    successResponse(res, 'Platform statistics retrieved', stats);
  } catch (error) {
    errorResponse(res, 'Failed to get platform stats', error);
  }
};

exports.getTraderStats = async (req, res) => {
  try {
    const { traderId } = req.params;
    const stats = await statsService.getTraderStats(traderId);
    successResponse(res, 'Trader statistics retrieved', stats);
  } catch (error) {
    errorResponse(res, 'Failed to get trader stats', error);
  }
};
