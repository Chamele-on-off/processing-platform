const pdfParser = require('./pdf/pdf-parser.service');
const pdfValidator = require('./pdf/pdf-validator.service');
const logger = require('../../utils/logger');

module.exports = {
  async analyzePdf(pdfUrl) {
    try {
      // Шаг 1: Парсинг PDF
      const parsedData = await pdfParser.parsePdf(pdfUrl);
      
      // Шаг 2: Валидация содержимого
      const validationResults = await pdfValidator.validatePdfContent(parsedData);
      
      return {
        parsedData,
        validationResults
      };
    } catch (error) {
      logger.error('PDF analysis failed:', error);
      throw error;
    }
  },

  async verifyTransactionProof(transactionId, pdfUrl) {
    try {
      const { parsedData, validationResults } = await this.analyzePdf(pdfUrl);
      
      if (!validationResults.isValid) {
        throw new Error(`Invalid PDF proof: ${validationResults.errors.join(', ')}`);
      }

      // Дополнительная проверка соответствия транзакции
      const isMatch = await this.verifyTransactionMatch(transactionId, parsedData);
      
      return {
        isValid: validationResults.isValid && isMatch,
        details: parsedData,
        match: isMatch
      };
    } catch (error) {
      logger.error(`Transaction proof verification failed for ${transactionId}:`, error);
      throw error;
    }
  },

  async verifyTransactionMatch(transactionId, pdfData) {
    // Реализация проверки соответствия данных PDF и транзакции
    // ... запрос данных транзакции и сравнение с pdfData
    return true; // временная заглушка
  }
};
