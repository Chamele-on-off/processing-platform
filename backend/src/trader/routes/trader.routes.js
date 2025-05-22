const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../common/auth/middlewares/auth.middleware');
const roleMiddleware = require('../../../common/auth/middlewares/role.middleware');
const {
  validateOrderFilters,
  validateOrderAction,
  validatePaymentDetail,
  validateDisputeCreation
} = require('../validators/trader.validators');

const {
  getActiveOrders,
  acceptOrder,
  rejectOrder,
  completeOrder
} = require('../controllers/orders.controller');

const {
  getPaymentDetails,
  addPaymentDetail,
  updatePaymentDetail,
  deletePaymentDetail
} = require('../controllers/details.controller');

const {
  getTraderStats,
  getPerformanceMetrics,
  getEarningsReport
} = require('../controllers/stats.controller');

const {
  getDisputes,
  getDisputeDetails,
  createDispute,
  addDisputeEvidence
} = require('../controllers/disputes.controller');

// Orders routes
router.get('/orders', 
  authMiddleware, 
  roleMiddleware('trader'), 
  validateOrderFilters, 
  getActiveOrders
);

router.post('/orders/:orderId/accept', 
  authMiddleware, 
  roleMiddleware('trader'), 
  validateOrderAction, 
  acceptOrder
);

router.post('/orders/:orderId/reject', 
  authMiddleware, 
  roleMiddleware('trader'), 
  validateOrderAction, 
  rejectOrder
);

router.post('/orders/:orderId/complete', 
  authMiddleware, 
  roleMiddleware('trader'), 
  validateOrderAction, 
  completeOrder
);

// Payment details routes
router.get('/payment-details', 
  authMiddleware, 
  roleMiddleware('trader'), 
  getPaymentDetails
);

router.post('/payment-details', 
  authMiddleware, 
  roleMiddleware('trader'), 
  validatePaymentDetail, 
  addPaymentDetail
);

router.put('/payment-details/:detailId', 
  authMiddleware, 
  roleMiddleware('trader'), 
  validatePaymentDetail, 
  updatePaymentDetail
);

router.delete('/payment-details/:detailId', 
  authMiddleware, 
  roleMiddleware('trader'), 
  deletePaymentDetail
);

// Statistics routes
router.get('/stats', 
  authMiddleware, 
  roleMiddleware('trader'), 
  getTraderStats
);

router.get('/stats/performance', 
  authMiddleware, 
  roleMiddleware('trader'), 
  getPerformanceMetrics
);

router.get('/stats/earnings', 
  authMiddleware, 
  roleMiddleware('trader'), 
  getEarningsReport
);

// Disputes routes
router.get('/disputes', 
  authMiddleware, 
  roleMiddleware('trader'), 
  getDisputes
);

router.get('/disputes/:disputeId', 
  authMiddleware, 
  roleMiddleware('trader'), 
  getDisputeDetails
);

router.post('/disputes', 
  authMiddleware, 
  roleMiddleware('trader'), 
  validateDisputeCreation, 
  createDispute
);

router.post('/disputes/:disputeId/evidence', 
  authMiddleware, 
  roleMiddleware('trader'), 
  addDisputeEvidence
);

module.exports = router;
