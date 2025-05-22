const { body, query, param } = require('express-validator');
const { TRANSACTION_TYPES, ORDER_STATUSES } = require('../../../common/utils/constants');

module.exports = {
  validateOrderFilters: [
    query('type')
      .optional()
      .isIn(TRANSACTION_TYPES)
      .withMessage('Invalid transaction type'),
    query('minAmount')
      .optional()
      .isFloat({ min: 0 })
      .toFloat()
      .withMessage('Minimum amount must be a positive number'),
    query('maxAmount')
      .optional()
      .isFloat({ min: 0 })
      .toFloat()
      .withMessage('Maximum amount must be a positive number')
  ],

  validateOrderAction: [
    param('orderId')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('reason')
      .if((value, { req }) => req.path.includes('reject'))
      .notEmpty()
      .withMessage('Reason is required for rejection')
      .isString()
      .withMessage('Reason must be a string')
      .isLength({ max: 500 })
      .withMessage('Reason cannot exceed 500 characters'),
    body('proofUrl')
      .if((value, { req }) => req.path.includes('complete'))
      .notEmpty()
      .withMessage('Proof URL is required for completion')
      .isURL()
      .withMessage('Invalid proof URL format')
  ],

  validatePaymentDetail: [
    body('type')
      .isIn(['bank_account', 'card', 'crypto', 'ewallet'])
      .withMessage('Invalid payment detail type'),
    body('details')
      .isObject()
      .withMessage('Details must be an object'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object')
  ],

  validateDisputeCreation: [
    body('orderId')
      .isMongoId()
      .withMessage('Invalid order ID'),
    body('reason')
      .notEmpty()
      .withMessage('Reason is required')
      .isString()
      .withMessage('Reason must be a string')
      .isLength({ max: 1000 })
      .withMessage('Reason cannot exceed 1000 characters'),
    body('evidence')
      .optional()
      .isArray()
      .withMessage('Evidence must be an array'),
    body('evidence.*')
      .isURL()
      .withMessage('Evidence items must be valid URLs')
  ]
};
