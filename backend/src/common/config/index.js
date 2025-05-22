const logger = require('../utils/logger');

module.exports = {
  // Основные настройки
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',

  // JWT настройки
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',

  // Настройки базы данных
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/processing',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50
    }
  },

  // Настройки Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: 24 * 60 * 60 // 24 часа
  },

  // Настройки RabbitMQ
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    queues: {
      transactions: 'transactions_queue',
      notifications: 'notifications_queue'
    }
  },

  // Настройки антифрода
  antifraud: {
    pdfAnalysisTimeout: process.env.PDF_ANALYSIS_TIMEOUT || 5000,
    maxTransactionAmount: process.env.MAX_TRANSACTION_AMOUNT || 100000
  },

  // Настройки API
  api: {
    prefix: '/api',
    version: 'v1',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 минут
      max: 100 // лимит запросов
    }
  },

  // Инициализация конфига
  init() {
    logger.info('Configuration loaded');
    logger.debug('Current config:', this.sanitizeForLog());
    return this;
  },

  // Метод для безопасного логирования (без секретов)
  sanitizeForLog() {
    const config = { ...this };
    delete config.jwtSecret;
    delete config.refreshTokenSecret;
    return config;
  }
}.init();
