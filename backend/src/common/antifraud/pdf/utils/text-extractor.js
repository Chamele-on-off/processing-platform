const { createWorker } = require('tesseract.js');
const logger = require('../../logger');

module.exports = {
  /**
   * Извлекает текст из изображения PDF
   * @param {Buffer} imageBuffer - Буфер изображения
   * @returns {Promise<string>} Распознанный текст
   */
  async extractTextFromImage(imageBuffer) {
    const worker = await createWorker({
      logger: m => logger.debug(`Tesseract: ${m.status}`)
    });
    
    try {
      await worker.loadLanguage('rus+eng');
      await worker.initialize('rus+eng');
      const { data } = await worker.recognize(imageBuffer);
      return data.text;
    } finally {
      await worker.terminate();
    }
  },

  /**
   * Нормализует текст (удаляет лишние пробелы, приводит к единому регистру)
   * @param {string} text - Исходный текст
   * @returns {string} Нормализованный текст
   */
  normalizeText(text) {
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  },

  /**
   * Извлекает сумму платежа из текста
   * @param {string} text - Текст чека
   * @returns {number|null} Сумма или null если не найдена
   */
  extractAmount(text) {
    const amountRegex = /(?:итого|сумма|к оплате)[:\s]*(\d+[\.,]\d{2})/i;
    const match = text.match(amountRegex);
    if (!match) return null;

    return parseFloat(match[1].replace(',', '.'));
  }
};
