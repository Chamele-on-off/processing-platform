const app = require('./app');
const config = require('./common/config');
const db = require('./common/config/db');
const redis = require('./common/config/redis');
const rabbitmq = require('./common/config/rabbitmq');
const logger = require('./common/utils/logger');
const paymentVerification = require('./common/services/payment-verification.service');
const depositService = require('./common/services/deposit.service');
const requisitesService = require('./common/services/requisites.service');

class Server {
  constructor() {
    this.server = null;
    this.shuttingDown = false;
  }

  async start() {
    try {
      logger.info('Starting server...');
      
      // 1. Connect to DB and other services
      await this.connectServices();
      
      // 2. Initialize application services
      await this.initServices();
      
      // 3. Start HTTP server
      this.server = app.listen(config.port, () => {
        logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      });
      
      // 4. Setup graceful shutdown
      this.setupShutdownHandlers();
      
      return this.server;
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async connectServices() {
    logger.info('Connecting to services...');
    await db.connect();
    await redis.connect();
    await rabbitmq.connect();
    logger.info('All services connected');
  }

  async initServices() {
    logger.info('Initializing services...');
    
    // Инициализация сервиса проверки платежей
    await paymentVerification.init();
    
    // Инициализация сервиса работы с реквизитами
    await requisitesService.init();
    
    // Проверка депозитов в ожидании
    await depositService.checkPendingDeposits();
    
    logger.info('All services initialized');
  }

  setupShutdownHandlers() {
    process.on('SIGTERM', this.gracefulShutdown.bind(this, 'SIGTERM'));
    process.on('SIGINT', this.gracefulShutdown.bind(this, 'SIGINT'));
    process.on('unhandledRejection', this.handleUnhandledRejection.bind(this));
    process.on('uncaughtException', this.handleUncaughtException.bind(this));
  }

  async gracefulShutdown(signal) {
    if (this.shuttingDown) return;
    this.shuttingDown = true;
    
    logger.info(`${signal} received. Shutting down gracefully...`);
    
    try {
      // 1. Close HTTP server
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
      }
      
      // 2. Disconnect services
      await db.disconnect();
      await redis.disconnect();
      await rabbitmq.disconnect();
      
      logger.info('Server stopped successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }

  handleUnhandledRejection(err) {
    logger.error('Unhandled Rejection! Shutting down...', err);
    this.gracefulShutdown('unhandledRejection');
  }

  handleUncaughtException(err) {
    logger.error('Uncaught Exception! Shutting down...', err);
    this.gracefulShutdown('uncaughtException');
  }
}

// Запуск сервера
new Server().start().catch((err) => {
  logger.error('Fatal error during server startup:', err);
  process.exit(1);
});
