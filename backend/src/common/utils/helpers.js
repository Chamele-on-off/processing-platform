const crypto = require('crypto');
const logger = require('./logger');

module.exports = {
  generateRandomString(length = 32) {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  },

  hashData(data, salt = null) {
    try {
      const hash = crypto.createHash('sha256');
      if (salt) {
        hash.update(data + salt);
      } else {
        hash.update(data);
      }
      return hash.digest('hex');
    } catch (error) {
      logger.error('Hashing failed:', error);
      throw error;
    }
  },

  calculateTimeDifference(startDate, endDate) {
    return (new Date(endDate) - new Date(startDate)) / 1000; // в секундах
  },

  formatCurrency(amount, currency = 'RUB') {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency
    }).format(amount);
  },

  sanitizeObject(obj, fieldsToRemove = []) {
    const result = { ...obj };
    fieldsToRemove.forEach(field => delete result[field]);
    return result;
  },

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  parsePagination(query) {
    const page = Math.abs(parseInt(query.page, 10)) || 1;
    const limit = Math.abs(parseInt(query.limit, 10)) || 100;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }
};
