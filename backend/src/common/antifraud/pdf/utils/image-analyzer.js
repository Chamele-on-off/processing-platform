const { Image } = require('image-js');
const logger = require('../../logger');

module.exports = {
  /**
   * Анализирует изображение на признаки подделки
   * @param {Buffer} imageBuffer - Буфер изображения
   * @returns {Promise<Object>} Результаты анализа
   */
  async analyzeImage(imageBuffer) {
    try {
      const image = await Image.load(imageBuffer);
      
      // 1. Проверка разрешения
      const resolutionCheck = this.checkResolution(image);
      
      // 2. Анализ шумов
      const noiseAnalysis = this.analyzeNoise(image);
      
      // 3. Поиск следов редактирования
      const editMarkers = this.findEditMarkers(image);
      
      return {
        resolution: resolutionCheck,
        noiseLevel: noiseAnalysis,
        editMarkers,
        isSuspicious: resolutionCheck.isLowQuality || editMarkers.found
      };
    } catch (error) {
      logger.error('Image analysis failed:', error);
      throw error;
    }
  },

  /**
   * Проверка разрешения изображения
   */
  checkResolution(image) {
    const MIN_DPI = 150;
    const dpi = Math.min(image.width, image.height) / 8.27; // A4 width in inches
    
    return {
      dpi,
      isLowQuality: dpi < MIN_DPI,
      recommendedMinDpi: MIN_DPI
    };
  },

  /**
   * Анализ уровня шумов
   */
  analyzeNoise(image) {
    const grey = image.grey();
    const histogram = grey.histogram(256);
    const totalPixels = image.width * image.height;
    
    // Процент "шумных" пикселей (очень темных/очень светлых)
    const noisePercent = (
      histogram[0] + 
      histogram[255] + 
      (histogram[1] + histogram[254]) * 0.5
    ) / totalPixels * 100;
    
    return {
      noisePercent,
      isNoisy: noisePercent > 15
    };
  },

  /**
   * Поиск следов редактирования
   */
  findEditMarkers(image) {
    // Анализ градиентов для поиска резких переходов
    const gradients = image.gradient();
    const sharpEdges = gradients
      .threshold({ algorithm: 'otsu' })
      .pixels
      .filter(v => v > 200).length;
    
    const edgeRatio = sharpEdges / (image.width * image.height);
    
    return {
      edgeRatio,
      found: edgeRatio > 0.1
    };
  }
};
