module.exports = {
  ...existingFunctions,

  async validatePdfImages(pdfData) {
    if (!pdfData.imageAnalysis) return { isValid: true };
    
    return {
      isValid: !pdfData.imageAnalysis.isSuspicious,
      warnings: pdfData.imageAnalysis.isSuspicious 
        ? ['Возможные признаки редактирования изображения'] 
        : []
    };
  }
};
