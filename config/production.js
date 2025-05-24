module.exports = {
  NODE_ENV: 'production',
  PORT: 3000,
  DB_URL: process.env.DB_URL || 'mongodb://mongo:27017/production-db',
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_URL: process.env.REDIS_URL || 'redis://redis:6379',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://rabbitmq',
  FRONTEND_URL: process.env.FRONTEND_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 минут
  RATE_LIMIT_MAX: 100 // 100 запросов за период
};
