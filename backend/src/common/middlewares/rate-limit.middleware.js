const rateLimit = require('express-rate-limit');
const { rateLimit: config } = require('../config');
const logger = require('../utils/logger');

const apiLimiter = rateLimit({
  windowMs: config.windowMs,
  max: config.max,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later'
  },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later'
  },
  skip: req => !req.path.includes('/login')
});

module.exports = {
  apiLimiter,
  authLimiter
};
