const app = require('./app');
const config = require('./common/config');

const startServer = async () => {
  try {
    // Инициализация подключений к БД и другим сервисам
    await require('./common/config/db').connect();
    await require('./common/config/redis').connect();
    await require('./common/config/rabbitmq').connect();

    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
