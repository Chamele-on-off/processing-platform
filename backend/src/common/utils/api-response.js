const logger = require('./logger');

module.exports.successResponse = (res, message, data = {}, statusCode = 200) => {
  logger.info(`[${statusCode}] ${message}`);
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

module.exports.errorResponse = (res, message, error = null, statusCode = 500) => {
  logger.error(`[${statusCode}] ${message}`, error);
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};

module.exports.validationError = (res, errors) => {
  logger.warn(`[400] Validation Error: ${JSON.stringify(errors)}`);
  res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });
};

module.exports.paginatedResponse = (res, message, data, pagination) => {
  logger.info(`[200] ${message}`);
  res.status(200).json({
    success: true,
    message,
    data,
    pagination
  });
};
