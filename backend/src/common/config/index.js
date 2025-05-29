const logger = require('../utils/logger');

module.exports = {
  // Application
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',

  // Security
  isProduction: process.env.NODE_ENV === 'production',
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost'],
  cookieSecret: process.env.COOKIE_SECRET || 'your-secret-key',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100
  },

  // Database
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/processing',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50
    }
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: 24 * 60 * 60 // 24 hours
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },

  // Monitoring
  monitoring: {
    interval: process.env.MONITORING_INTERVAL || 30000, // 30 seconds
    memoryThreshold: 0.8, // 80% memory usage
    cpuThreshold: 0.7 // 70% CPU usage
  },

  // Init and validation
  init() {
    if (this.isProduction) {
      this.validateProductionConfig();
    }
    logger.info('Configuration loaded');
    return this;
  },

  validateProductionConfig() {
    const required = ['MONGODB_URI', 'JWT_SECRET', 'REDIS_URL', 'COOKIE_SECRET'];
    required.forEach(key => {
      if (!process.env[key]) {
        throw new Error(`Missing required config: ${key}`);
      }
    });
  }
}.init();
