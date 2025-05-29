const { body } = require('express-validator');

module.exports = {
  validateRequisiteRequest: [
    body('amount')
      .isFloat({ min: 100 })
      .withMessage('Amount must be at least 100')
      .toFloat(),
    body('currency')
      .isString()
      .isIn(['RUB', 'USD', 'EUR'])
      .withMessage('Invalid currency'),
    body('paymentMethod')
      .isString()
      .isIn(['bank_account', 'card', 'crypto'])
      .withMessage('Invalid payment method')
  ],

  validatePaymentConfirmation: [
    body('reservationKey')
      .isString()
      .notEmpty()
      .withMessage('Invalid reservation key'),
    body('clientData')
      .isObject()
      .withMessage('Client data must be an object'),
    body('clientData.email')
      .optional()
      .isEmail()
      .withMessage('Invalid client email'),
    body('clientData.userId')
      .notEmpty()
      .withMessage('Client ID is required')
  ]
};
