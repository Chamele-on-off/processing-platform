const { body, query, param } = require('express-validator');
const { ROLES, USER_STATUSES, TRANSACTION_TYPES, TRANSACTION_STATUSES } = require('../../../common/utils/constants');

module.exports = {
  validateGetUsers: [
    query('role')
      .optional()
      .isIn(ROLES)
      .withMessage('Invalid role'),
    query('status')
      .optional()
      .isIn(USER_STATUSES)
      .withMessage('Invalid status'),
    query('search')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 }),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt()
  ],

  validateUpdateUser: [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('name')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 2, max: 50 }),
    body('status')
      .optional()
      .isIn(USER_STATUSES),
    body('maxTransactionLimit')
      .optional()
      .isFloat({ min: 0 })
      .toFloat()
  ],

  validateUpdateUserStatus: [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('status')
      .isIn(['active', 'suspended', 'banned'])
      .withMessage('Invalid status')
  ],

  validateGetTransactions: [
    query('type')
      .optional()
      .isIn(TRANSACTION_TYPES),
    query('status')
      .optional()
      .isIn(TRANSACTION_STATUSES),
    query('merchantId')
      .optional()
      .isMongoId(),
    query('traderId')
      .optional()
      .isMongoId(),
    query('dateFrom')
      .optional()
      .isISO8601(),
    query('dateTo')
      .optional()
      .isISO8601(),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt()
  ],

  validateFlagTransaction: [
    param('id')
      .isMongoId()
      .withMessage('Invalid transaction ID'),
    body('flagReason')
      .isString()
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage('Reason must be between 5 and 500 characters')
  ],

  validateResolveDispute: [
    param('id')
      .isMongoId()
      .withMessage('Invalid transaction ID'),
    body('resolution')
      .isString()
      .trim()
      .isLength({ min: 5, max: 1000 })
      .withMessage('Resolution must be between 5 and 1000 characters'),
    body('resolvedAmount')
      .isFloat({ min: 0 })
      .withMessage('Amount must be a positive number')
  ],

  validateTicketCreate: [
    body('subject')
      .isString()
      .trim()
      .isLength({ min: 5, max: 200 }),
    body('message')
      .isString()
      .trim()
      .isLength({ min: 10, max: 2000 }),
    body('type')
      .isString()
      .isIn(['technical', 'financial', 'other']),
    body('priority')
      .isInt({ min: 1, max: 5 })
      .toInt(),
    body('relatedTransaction')
      .optional()
      .isMongoId(),
    body('relatedOrder')
      .optional()
      .isMongoId()
  ],

  validateTicketUpdate: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ticket ID'),
    body('status')
      .optional()
      .isIn(['open', 'in_progress', 'resolved', 'closed']),
    body('message')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 10, max: 2000 })
  ],

  validateReportRequest: [
    body('startDate')
      .isISO8601()
      .withMessage('Invalid start date'),
    body('endDate')
      .isISO8601()
      .withMessage('Invalid end date'),
    body('format')
      .isIn(['pdf', 'csv', 'excel'])
      .withMessage('Invalid report format'),
    body('reportType')
      .optional()
      .isString()
      .isIn(['all', 'completed', 'disputed'])
  ]
};
