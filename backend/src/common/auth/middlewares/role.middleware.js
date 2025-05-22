const { errorResponse } = require('../../../utils/api-response');
const logger = require('../../../utils/logger');

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        logger.warn('Role check failed - no user in request');
        return errorResponse(res, 'Unauthorized', null, 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(`Role check failed for user ${req.user._id} - required: ${allowedRoles}, actual: ${req.user.role}`);
        return errorResponse(res, 'Forbidden', null, 403);
      }

      next();
    } catch (error) {
      logger.error('Role middleware error:', error);
      errorResponse(res, 'Authorization failed', error);
    }
  };
};
