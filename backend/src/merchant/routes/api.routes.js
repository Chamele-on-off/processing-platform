const express = require('express');
const router = express.Router();
const authMiddleware = require('../../common/auth/middlewares/auth.middleware');
const roleMiddleware = require('../../common/auth/middlewares/role.middleware');
const {
  validateRequisiteRequest,
  validatePaymentConfirmation
} = require('../validators/api.validators');

const {
  getPaymentRequisite,
  confirmPayment
} = require('../controllers/api.controller');

// Public API для интеграции с мерчантами
router.post('/requisite',
  authMiddleware,
  roleMiddleware('merchant'),
  validateRequisiteRequest,
  getPaymentRequisite
);

router.post('/confirm',
  authMiddleware,
  roleMiddleware('merchant'),
  validatePaymentConfirmation,
  confirmPayment
);

module.exports = router;
