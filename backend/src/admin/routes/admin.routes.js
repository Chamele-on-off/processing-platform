const express = require('express');
const router = express.Router();
const authMiddleware = require('../../common/auth/middlewares/auth.middleware');
const roleMiddleware = require('../../common/auth/middlewares/role.middleware');
const {
  validateGetUsers,
  validateUpdateUser,
  validateUpdateUserStatus,
  validateGetTransactions,
  validateFlagTransaction,
  validateResolveDispute,
  validateTicketCreate,
  validateTicketUpdate,
  validateReportRequest
} = require('../validators/admin.validators');

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser
} = require('../controllers/users.controller');

const {
  getAllTransactions,
  getTransactionDetails,
  flagTransaction,
  resolveDispute
} = require('../controllers/transactions.controller');

const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
  addMessageToTicket,
  assignTicket
} = require('../controllers/tickets.controller');

const {
  generateTransactionReport,
  generateUserActivityReport,
  getReportHistory
} = require('../controllers/reports.controller');

// Users routes
router.get('/users', authMiddleware, roleMiddleware('admin'), validateGetUsers, getAllUsers);
router.get('/users/:id', authMiddleware, roleMiddleware('admin'), getUserById);
router.put('/users/:id', authMiddleware, roleMiddleware('admin'), validateUpdateUser, updateUser);
router.patch('/users/:id/status', authMiddleware, roleMiddleware('admin'), validateUpdateUserStatus, updateUserStatus);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

// Transactions routes
router.get('/transactions', authMiddleware, roleMiddleware('admin'), validateGetTransactions, getAllTransactions);
router.get('/transactions/:id', authMiddleware, roleMiddleware('admin'), getTransactionDetails);
router.post('/transactions/:id/flag', authMiddleware, roleMiddleware('admin'), validateFlagTransaction, flagTransaction);
router.post('/transactions/:id/resolve', authMiddleware, roleMiddleware('admin'), validateResolveDispute, resolveDispute);

// Tickets routes
router.get('/tickets', authMiddleware, roleMiddleware('admin'), getAllTickets);
router.get('/tickets/:id', authMiddleware, roleMiddleware('admin'), getTicketById);
router.post('/tickets', authMiddleware, roleMiddleware('admin'), validateTicketCreate, createTicket);
router.patch('/tickets/:id/status', authMiddleware, roleMiddleware('admin'), validateTicketUpdate, updateTicketStatus);
router.post('/tickets/:id/message', authMiddleware, roleMiddleware('admin'), validateTicketUpdate, addMessageToTicket);
router.post('/tickets/:id/assign', authMiddleware, roleMiddleware('admin'), assignTicket);

// Reports routes
router.post('/reports/transactions', authMiddleware, roleMiddleware('admin'), validateReportRequest, generateTransactionReport);
router.post('/reports/user-activity', authMiddleware, roleMiddleware('admin'), validateReportRequest, generateUserActivityReport);
router.get('/reports/history', authMiddleware, roleMiddleware('admin'), getReportHistory);

module.exports = router;
