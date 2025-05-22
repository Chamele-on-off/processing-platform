const app = require('./app');
const config = require('./common/config');
const db = require('./common/config/db');
const redis = require('./common/config/redis');
const rabbitmq = require('./common/config/rabbitmq');
const logger = require('./common/utils/logger');

const startServer = async () => {
  try {
    // 1. Connect to DB and other services
    await db.connect();
    await redis.connect();
    await rabbitmq.connect();

    // 2. Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
    });

    // 3. Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(async () => {
        await db.disconnect();
        await redis.disconnect();
        await rabbitmq.disconnect();
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection! Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
