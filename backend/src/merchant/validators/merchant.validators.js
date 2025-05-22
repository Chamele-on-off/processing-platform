const { body, query, param } = require('express-validator');
const { TRANSACTION_TYPES, ORDER_STATUSES } = require('../../../common/utils/constants');

module.exports = {
  validateDepositOrder: [
    body('amount')
      .isFloat({ min: 100 }) // Минимальная сумма депозита
      .withMessage('Amount must be at least 100')
      .toFloat(),
    body('paymentDetails')
      .isObject()
      .withMessage('Payment details must be an object'),
    body('paymentDetails.type')
      .isIn(['bank', 'card', 'crypto', 'ewallet'])
      .withMessage('Invalid payment method type')
  ],

  validateWithdrawalOrder: [
    body('amount')
      .isFloat({ min: 500 }) // Минимальная сумма вывода
      .withMessage('Amount must be at least 500')
      .toFloat(),
    body('destination')
      .isObject()
      .withMessage('Destination must be an object'),
    body('destination.type')
      .isIn(['bank', 'crypto', 'ewallet'])
      .withMessage('Invalid withdrawal destination type'),
    body('destination.details')
      .isObject()
      .withMessage('Destination details must be an object')
  ],

  validateOrderHistory: [
    query('status')
      .optional()
      .isIn(ORDER_STATUSES)
      .withMessage('Invalid order status'),
    query('type')
      .optional()
      .isIn(['deposit', 'withdrawal'])
      .withMessage('Invalid order type'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .toInt()
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt()
      .withMessage('Limit must be between 1 and 100')
  ],

  validateTransactionHistory: [
    query('type')
      .optional()
      .isIn(TRANSACTION_TYPES)
      .withMessage('Invalid transaction type'),
    query('status')
      .optional()
      .isIn(['pending', 'completed', 'failed', 'disputed'])
      .withMessage('Invalid transaction status'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid start date format'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid end date format'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt()
  ],

  validateDispute: [
    param('transactionId')
      .isMongoId()
      .withMessage('Invalid transaction ID'),
    body('reason')
      .isString()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Reason must be between 10 and 1000 characters'),
    body('evidence')
      .optional()
      .isArray()
      .withMessage('Evidence must be an array'),
    body('evidence.*')
      .isURL()
      .withMessage('Each evidence item must be a valid URL')
  ],

  validateWithdrawalRequest: [
    body('amount')
      .isFloat({ min: 100 })
      .withMessage('Amount must be at least 100')
      .toFloat(),
    body('destination')
      .isObject()
      .withMessage('Destination must be an object'),
    body('destination.type')
      .isIn(['bank', 'crypto', 'ewallet'])
      .withMessage('Invalid withdrawal destination type'),
    body('destination.details')
      .isObject()
      .withMessage('Destination details must be an object')
  ]
};
