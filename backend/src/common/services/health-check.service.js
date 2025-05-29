const mongoose = require('mongoose');
const redis = require('../config/redis');
const logger = require('../utils/logger');

class HealthCheckService {
  async checkDatabase() {
    try {
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy' };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  async checkRedis() {
    try {
      const result = await redis.ping();
      return result === 'PONG' 
        ? { status: 'healthy' }
        : { status: 'unhealthy', error: 'Invalid response' };
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  async checkMemory() {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const total = process.memoryUsage().heapTotal / 1024 / 1024;
    return {
      status: used / total < 0.8 ? 'healthy' : 'warning',
      memoryUsage: `${Math.round(used * 100) / 100}MB / ${Math.round(total * 100) / 100}MB`
    };
  }

  async fullCheck() {
    const [db, redis, memory] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkMemory()
    ]);

    const isHealthy = 
      db.status === 'healthy' && 
      redis.status === 'healthy' &&
      memory.status !== 'unhealthy';

    return {
      isHealthy,
      details: { db, redis, memory },
      timestamp: new Date(),
      uptime: process.uptime()
    };
  }
}

module.exports = new HealthCheckService();
