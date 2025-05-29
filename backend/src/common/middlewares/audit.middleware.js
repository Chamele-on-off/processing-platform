const auditService = require('../services/audit.service');
const logger = require('../utils/logger');

module.exports = (action, entityType) => {
  return async (req, res, next) => {
    try {
      const entityId = req.params.id || null;
      await auditService.logAction(
        req.user?.id,
        action,
        entityType,
        entityId,
        {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          method: req.method,
          path: req.path,
          body: req.body
        }
      );
      next();
    } catch (error) {
      logger.error('Audit middleware failed:', error);
      next();
    }
  };
};
