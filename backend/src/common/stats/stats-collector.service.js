const traderMetrics = require('./metrics/trader-metrics');
const merchantMetrics = require('./metrics/merchant-metrics');
const logger = require('../../utils/logger');

module.exports = {
  async getPlatformStats() {
    try {
      const [traderStats, merchantStats] = await Promise.all([
        traderMetrics.getPlatformWideMetrics(),
        merchantMetrics.getPlatformWideMetrics()
      ]);

      return {
        traders: traderStats,
        merchants: merchantStats,
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Failed to collect platform stats:', error);
      throw error;
    }
  },

  async getTraderStats(traderId) {
    try {
      return traderMetrics.getTraderMetrics(traderId);
    } catch (error) {
      logger.error(`Failed to collect stats for trader ${traderId}:`, error);
      throw error;
    }
  },

  async getMerchantStats(merchantId) {
    try {
      return merchantMetrics.getMerchantMetrics(merchantId);
    } catch (error) {
      logger.error(`Failed to collect stats for merchant ${merchantId}:`, error);
      throw error;
    }
  },

  async getDailyReports(date = new Date()) {
    try {
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      return {
        date: startOfDay,
        transactions: await this.getDailyTransactionReport(startOfDay, endOfDay),
        orders: await this.getDailyOrderReport(startOfDay, endOfDay),
        users: await this.getDailyUserReport(startOfDay, endOfDay)
      };
    } catch (error) {
      logger.error('Failed to generate daily report:', error);
      throw error;
    }
  },

  async getDailyTransactionReport(start, end) {
    // Реализация сбора статистики по транзакциям
  },

  async getDailyOrderReport(start, end) {
    // Реализация сбора статистики по ордерам
  },

  async getDailyUserReport(start, end) {
    // Реализация сбора статистики по пользователям
  }
};
