const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../common/auth/middlewares/auth.middleware');
const roleMiddleware = require('../../../common/auth/middlewares/role.middleware');
const {
  validateDepositOrder,
  validateWithdrawalOrder,
  validateOrderHistory,
  validateTransactionHistory,
  validateDispute,
  validateWithdrawalRequest
} = require('../validators/merchant.validators');

const {
  createDepositOrder,
  createWithdrawalOrder,
  getOrderHistory,
  cancelOrder
} = require('../controllers/orders.controller');

const {
  getTransactionHistory,
  getTransactionDetails,
  disputeTransaction
} = require('../controllers/transactions.controller');

const {
  getCurrentBalance,
  getBalanceHistory,
  requestWithdrawal
} = require('../controllers/balance.controller');

// Orders routes
router.post('/orders/deposit',
  authMiddleware,
  roleMiddleware('merchant'),
  validateDepositOrder,
  createDepositOrder
);

router.post('/orders/withdrawal',
  authMiddleware,
  roleMiddleware('merchant'),
  validateWithdrawalOrder,
  createWithdrawalOrder
);

router.get('/orders',
  authMiddleware,
  roleMiddleware('merchant'),
  validateOrderHistory,
  getOrderHistory
);

router.delete('/orders/:orderId',
  authMiddleware,
  roleMiddleware('merchant'),
  cancelOrder
);

// Transactions routes
router.get('/transactions',
  authMiddleware,
  roleMiddleware('merchant'),
  validateTransactionHistory,
  getTransactionHistory
);

router.get('/transactions/:transactionId',
  authMiddleware,
  roleMiddleware('merchant'),
  getTransactionDetails
);

router.post('/transactions/:transactionId/dispute',
  authMiddleware,
  roleMiddleware('merchant'),
  validateDispute,
  disputeTransaction
);

// Balance routes
router.get('/balance',
  authMiddleware,
  roleMiddleware('merchant'),
  getCurrentBalance
);

router.get('/balance/history',
  authMiddleware,
  roleMiddleware('merchant'),
  getBalanceHistory
);

router.post('/balance/withdraw',
  authMiddleware,
  roleMiddleware('merchant'),
  validateWithdrawalRequest,
  requestWithdrawal
);

module.exports = router;
