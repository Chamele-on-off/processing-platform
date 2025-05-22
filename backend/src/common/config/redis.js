const redis = require('redis');
const logger = require('../utils/logger');

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            logger.error('Too many retries on Redis. Connection terminated');
            return new Error('Too many retries');
          }
          return Math.min(retries * 100, 5000);
        }
      }
    });

    this.client.on('error', (err) => {
      logger.error('Redis error:', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis connected');
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    this.client.on('ready', () => {
      logger.info('Redis ready');
    });
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      logger.error('Redis connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.quit();
      logger.info('Redis disconnected');
    } catch (error) {
      logger.error('Redis disconnection failed:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      await this.client.ping();
      return { status: 'up' };
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return { status: 'down', error };
    }
  }

  async set(key, value, ttl = null) {
    try {
      if (ttl) {
        return await this.client.set(key, value, { EX: ttl });
      }
      return await this.client.set(key, value);
    } catch (error) {
      logger.error('Redis set failed:', error);
      throw error;
    }
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error('Redis get failed:', error);
      throw error;
    }
  }

  async del(key) {
    try {
      return await this.client.del(key);
    } catch (error) {
      logger.error('Redis delete failed:', error);
      throw error;
    }
  }

  async keys(pattern) {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      logger.error('Redis keys failed:', error);
      throw error;
    }
  }
}

module.exports = new RedisClient();
