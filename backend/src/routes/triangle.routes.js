import express from 'express';
import TriangleController from '../controllers/triangle.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = express.Router();

router.get(
  '/transactions',
  authMiddleware,
  roleMiddleware(['admin']),
  TriangleController.getTransactions
);

router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(['admin']),
  TriangleController.getStats
);

router.post(
  '/:id/confirm',
  authMiddleware,
  roleMiddleware(['admin']),
  TriangleController.confirmTransaction
);

router.post(
  '/:id/cancel',
  authMiddleware,
  roleMiddleware(['admin']),
  TriangleController.cancelTransaction
);

router.post(
  '/manual',
  authMiddleware,
  roleMiddleware(['admin']),
  TriangleController.createManual
);

router.get(
  '/settings',
  authMiddleware,
  roleMiddleware(['admin']),
  TriangleController.getSettings
);

router.put(
  '/settings',
  authMiddleware,
  roleMiddleware(['admin']),
  TriangleController.updateSettings
);

router.get(
  '/search',
  authMiddleware,
  roleMiddleware(['admin']),
  TriangleController.searchTransactions
);

export default router;
