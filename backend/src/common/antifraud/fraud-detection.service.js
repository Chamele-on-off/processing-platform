const ipGeoRule = require('./rules/ip-geo.rule');
const transactionPatternsRule = require('./rules/transaction-patterns.rule');
const pdfValidationRule = require('./rules/pdf-validation.rule');
const logger = require('../../utils/logger');

module.exports = {
  async analyzeTransaction(transaction) {
    try {
      const results = await Promise.all([
        ipGeoRule.check(transaction),
        transactionPatternsRule.check(transaction),
        transaction.proofUrl ? pdfValidationRule.check(transaction.proofUrl) : Promise.resolve([])
      ]);

      // Объединяем все найденные аномалии
      const anomalies = results.flat();
      
      if (anomalies.length > 0) {
        logger.warn(`Detected anomalies in transaction ${transaction._id}:`, anomalies);
        await this.handleAnomalies(transaction, anomalies);
      }

      return anomalies;
    } catch (error) {
      logger.error('Fraud detection error:', error);
      throw error;
    }
  },

  async handleAnomalies(transaction, anomalies) {
    const actions = [];
    
    if (anomalies.includes('suspicious_ip_location')) {
      actions.push(this.flagTransaction(transaction._id, 'Suspicious IP location'));
    }

    if (anomalies.includes('unusual_transaction_pattern')) {
      actions.push(this.limitTraderAccount(transaction.trader));
    }

    if (anomalies.includes('invalid_pdf_proof')) {
      actions.push(this.rejectTransaction(transaction._id, 'Invalid PDF proof'));
    }

    await Promise.all(actions);
  },

  async flagTransaction(transactionId, reason) {
    // Реализация флагинга транзакции
    logger.info(`Flagging transaction ${transactionId}: ${reason}`);
    // ... обновление статуса транзакции в БД
  },

  async limitTraderAccount(traderId) {
    // Реализация ограничений для трейдера
    logger.info(`Applying limits to trader ${traderId}`);
    // ... обновление статуса трейдера в БД
  },

  async rejectTransaction(transactionId, reason) {
    // Реализация отклонения транзакции
    logger.info(`Rejecting transaction ${transactionId}: ${reason}`);
    // ... обновление статуса транзакции в БД
  }
};
