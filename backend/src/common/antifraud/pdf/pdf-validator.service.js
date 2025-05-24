const { PDFDocument } = require('pdf-lib');
const { validateSignature } = require('./digital-signature');
const logger = require('../../utils/logger');
const { ValidationError } = require('../../utils/error-handler');

module.exports = {
  async validatePdfContent(parsedPdf) {
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

    // Проверка 4: Цифровая подпись
    const signatureCheck = await this.validateDigitalSignature(parsedPdf.buffer);
    if (!signatureCheck.isValid) {
      errors.push('invalid_digital_signature');
    }

    return {
      isValid: errors.length === 0,
      errors,
      signatureValid: signatureCheck.isValid
    };
  },

  async validateDigitalSignature(pdfBuffer) {
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const signature = pdfDoc.getSignature();

      if (!signature) {
        return { isValid: false, error: 'missing_signature' };
      }

      const isVerified = await validateSignature({
        signature: signature.toString('hex'),
        originalData: pdfBuffer
      });

      return {
        isValid: isVerified,
        error: isVerified ? null : 'invalid_signature'
      };
    } catch (error) {
      logger.error('Signature validation failed:', error);
      return { isValid: false, error: 'validation_failed' };
    }
  },

  hasSuspiciousMetadata(metadata) {
    const suspiciousCreators = ['Photoshop', 'Acrobat', 'Illustrator'];
    return suspiciousCreators.some(name => 
      metadata.creator?.includes(name) || metadata.author?.includes(name)
    );
  },

  signsOfEditing(rawData) {
    if (rawData.creationDate && rawData.modificationDate) {
      const diff = rawData.modificationDate - rawData.creationDate;
      return diff > 1000 * 60 * 5;
    }
    return false;
  },

  async validatePdfImages(pdfData) {
    if (!pdfData.imageAnalysis) return { isValid: true };
    
    return {
      isValid: !pdfData.imageAnalysis.isSuspicious,
      warnings: pdfData.imageAnalysis.isSuspicious 
        ? ['possible_image_tampering'] 
        : []
    };
  }
};
