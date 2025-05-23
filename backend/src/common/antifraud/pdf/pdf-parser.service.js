const { parsePdf } = require('./pdf-parser.service');
const { extractTextFromImage } = require('./utils/text-extractor');
const { analyzeImage } = require('./utils/image-analyzer');

module.exports = {
  async parsePdf(pdfUrl) {
    const pdfData = await parsePdf(pdfUrl);
    
    // Дополнительная проверка изображений в PDF
    if (pdfData.hasImages) {
      const imageAnalysis = await analyzeImage(pdfData.images[0]);
      pdfData.imageAnalysis = imageAnalysis;
    }
    
    return pdfData;
  }
};
