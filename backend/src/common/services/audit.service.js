const AuditLog = require('../models/audit-log.model');
const logger = require('../utils/logger');

class AuditService {
  async logAction(userId, action, entityType, entityId, metadata = {}) {
    try {
      const log = new AuditLog({
        user: userId,
        action,
        entityType,
        entityId,
        metadata,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent
      });

      await log.save();
      return log;
    } catch (error) {
      logger.error('Audit log failed:', error);
      throw error;
    }
  }

  async getLogs(filter = {}, pagination = {}) {
    try {
      const { page = 1, limit = 50 } = pagination;
      
      const [logs, total] = await Promise.all([
        AuditLog.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user', 'name email role'),
        AuditLog.countDocuments(filter)
      ]);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Failed to get audit logs:', error);
      throw error;
    }
  }
}

module.exports = new AuditService();
