const logger = require('./logger');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const errorResponse = {
    status: err.status,
    message: err.message
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    logger.error(`[${err.statusCode}] ${err.message}`);
    logger.error(err.stack);
  }

  if (err.isOperational) {
    logger.error(`Operational Error: ${err.message}`);
  } else {
    logger.error('Critical Error:', err);
    // Здесь можно отправить уведомление администратору
  }

  res.status(err.statusCode).json(errorResponse);
};

module.exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports.AppError = class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};
