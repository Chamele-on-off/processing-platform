const logger = require('../../../utils/logger');

module.exports = {
  async validatePdfContent(parsedPdf) {
    try {
      const errors = [];
      
      // Проверка 1: Наличие текста
      if (!parsedPdf.text || parsedPdf.text.trim().length < 10) {
        errors.push('invalid_pdf_content');
      }

      // Проверка 2: Подозрительные метаданные
      if (this.hasSuspiciousMetadata(parsedPdf.metadata)) {
        errors.push('suspicious_pdf_metadata');
      }

      // Проверка 3: Признаки редактирования
      if (this.signsOfEditing(parsedPdf.raw)) {
        errors.push('pdf_edited_signs');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      logger.error('PDF validation failed:', error);
      return {
        isValid: false,
        errors: ['validation_failed']
      };
    }
  },

  hasSuspiciousMetadata(metadata) {
    // Проверка подозрительных авторов/создателей
    const suspiciousCreators = ['Photoshop', 'Acrobat', 'Illustrator'];
    return suspiciousCreators.some(name => 
      metadata.creator?.includes(name) || metadata.author?.includes(name)
    );
  },

  signsOfEditing(rawData) {
    // Разница между датой создания и модификации
    if (rawData.creationDate && rawData.modificationDate) {
      const diff = rawData.modificationDate - rawData.creationDate;
      return diff > 1000 * 60 * 5; // Изменения через 5+ минут после создания
    }
    return false;
  }
};
