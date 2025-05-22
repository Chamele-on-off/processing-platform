const passport = require('passport');
const { errorResponse } = require('../../../utils/api-response');
const logger = require('../../../utils/logger');

module.exports = passport.authenticate('jwt', { session: false, failWithError: true });

// Обработчик ошибок для JWT аутентификации
module.exports.errorHandler = (err, req, res, next) => {
  if (err) {
    logger.error('Authentication error:', err);
    return errorResponse(res, 'Authentication failed', null, 401);
  }

  if (!req.user) {
    return errorResponse(res, 'Unauthorized', null, 401);
  }

  // Проверка статуса пользователя
  if (req.user.status !== 'active') {
    return errorResponse(res, 'Account is not active', null, 403);
  }

  next();
};
