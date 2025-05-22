const { PDFDocument } = require('pdf-lib');
const fetch = require('node-fetch');
const logger = require('../../../utils/logger');

module.exports = {
  async parsePdf(pdfUrl) {
    try {
      // Загрузка PDF
      const response = await fetch(pdfUrl);
      const pdfBuffer = await response.arrayBuffer();
      
      // Парсинг PDF
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pages = pdfDoc.getPages();
      const textContents = await Promise.all(
        pages.map(page => page.getTextContent())
      );
      
      // Извлечение текста
      const text = textContents
        .map(content => content.items.map(item => item.str).join(' '))
        .join('\n');

      // Извлечение метаданных
      const metadata = {
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        creator: pdfDoc.getCreator(),
        isSigned: pdfDoc.isSigned(),
        pageCount: pdfDoc.getPageCount()
      };

      return {
        text,
        metadata,
        raw: {
          version: pdfDoc.getVersion(),
          keywords: pdfDoc.getKeywords(),
          creationDate: pdfDoc.getCreationDate(),
          modificationDate: pdfDoc.getModificationDate()
        }
      };
    } catch (error) {
      logger.error('PDF parsing failed:', error);
      throw error;
    }
  }
};
