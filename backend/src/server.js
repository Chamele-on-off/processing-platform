const app = require('./app');
const config = require('./common/config');
const db = require('./common/config/db');
const redis = require('./common/config/redis');
const rabbitmq = require('./common/config/rabbitmq');
const logger = require('./common/utils/logger');
const websocketService = require('./common/services/websocket.service');
const notificationService = require('./common/services/notification.service');
const paymentVerification = require('./common/services/payment-verification.service');
const depositService = require('./common/services/deposit.service');
const requisitesService = require('./common/services/requisites.service');

class ProcessingServer {
  constructor() {
    this.server = null;
    this.shuttingDown = false;
  }

  async start() {
    try {
      logger.info('Starting Processing Platform Server...');
      
      // 1. Initialize core services
      await this.initializeCoreServices();
      
      // 2. Create HTTP server
      this.server = app.listen(config.port, () => {
        logger.info(`Server running on port ${config.port} in ${config.env} mode`);
        logger.info(`API Base URL: ${config.baseUrl}${config.api.prefix}/${config.api.version}`);
      });
      
      // 3. Initialize real-time services
      await this.initializeRealtimeServices();
      
      // 4. Setup shutdown handlers
      this.setupShutdownHandlers();
      
      // 5. Start background workers
      this.startBackgroundWorkers();
      
      return this.server;
    } catch (error) {
      logger.error('Server startup failed:', error);
      process.exit(1);
    }
  }

  async initializeCoreServices() {
    logger.info('Initializing core services...');
    
    const services = [
      { name: 'Database', service: db.connect() },
      { name: 'Redis', service: redis.connect() },
      { name: 'RabbitMQ', service: rabbitmq.connect() }
    ];
    
    await this.executeServicesWithTimeout(services, 15000);
    logger.info('All core services connected');
  }

  async initializeRealtimeServices() {
    logger.info('Initializing real-time services...');
    
    // WebSocket and Notification services
    websocketService.initialize(this.server);
    notificationService.init(this.server);
    
    // Payment processing
    await paymentVerification.init();
    await requisitesService.init();
    await depositService.checkPendingDeposits();
    
    logger.info('Real-time services initialized');
  }

  async executeServicesWithTimeout(services, timeout) {
    const timeoutError = new Error(`Service initialization timed out after ${timeout}ms`);
    
    await Promise.all(services.map(async ({ name, service }) => {
      try {
        await Promise.race([
          service,
          new Promise((_, reject) => 
            setTimeout(() => reject(timeoutError), timeout)
          )
        ]);
        logger.info(`${name} connected successfully`);
      } catch (error) {
        logger.error(`${name} connection failed:`, error);
        throw error;
      }
    }));
  }

  startBackgroundWorkers() {
    logger.info('Starting background workers...');
    
    // Здесь можно добавить периодические задачи, например:
    // - Очистка старых данных
    // - Проверка здоровья сервисов
    // - Генерация отчетов
    
    logger.info('Background workers started');
  }

  setupShutdownHandlers() {
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
    process.on('unhandledRejection', (err) => this.handleUnhandledError('unhandledRejection', err));
    process.on('uncaughtException', (err) => this.handleUnhandledError('uncaughtException', err));
  }

  async gracefulShutdown(signal) {
    if (this.shuttingDown) return;
    this.shuttingDown = true;
    
    logger.info(`${signal} received. Starting graceful shutdown...`);
    
    try {
      // 1. Close HTTP server
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(() => {
            logger.info('HTTP server closed');
            resolve();
          });
        });
      }
      
      // 2. Disconnect services
      await this.disconnectServices();
      
      // 3. Close remaining connections
      await this.cleanup();
      
      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Graceful shutdown failed:', error);
      process.exit(1);
    }
  }

  async disconnectServices() {
    const services = [
      { name: 'RabbitMQ', service: rabbitmq.disconnect() },
      { name: 'Redis', service: redis.disconnect() },
      { name: 'Database', service: db.disconnect() }
    ];
    
    await Promise.all(services.map(async ({ name, service }) => {
      try {
        await service;
        logger.info(`${name} disconnected successfully`);
      } catch (error) {
        logger.error(`${name} disconnection failed:`, error);
      }
    }));
  }

  async cleanup() {
    // Дополнительная очистка при необходимости
    const activeConnections = websocketService.clients.size;
    if (activeConnections > 0) {
      logger.info(`Closing ${activeConnections} WebSocket connections`);
      websocketService.broadcast({ type: 'shutdown', message: 'Server is restarting' });
    }
  }

  handleUnhandledError(type, err) {
    logger.error(`${type}:`, err);
    
    // Для uncaughtException попытаться завершить процесс более аккуратно
    if (type === 'uncaughtException') {
      setTimeout(() => process.exit(1), 1000);
    }
    
    this.gracefulShutdown(type);
  }
}

// Запуск сервера
const server = new ProcessingServer();
server.start().catch((err) => {
  logger.error('Fatal error during server startup:', err);
  process.exit(1);
});
