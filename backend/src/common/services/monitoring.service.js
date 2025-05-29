const logger = require('../utils/logger');
const { monitoring } = require('../config');
const os = require('os');
const mongoose = require('mongoose');
const redis = require('../config/redis');

class MonitoringService {
  constructor() {
    this.metrics = {
      startTime: Date.now(),
      checks: 0,
      errors: 0
    };
    this.thresholds = {
      memory: monitoring.memoryThreshold,
      cpu: monitoring.cpuThreshold
    };
  }

  async start() {
    logger.info('Starting monitoring service');
    setInterval(() => this.collectMetrics(), monitoring.interval);
  }

  async collectMetrics() {
    try {
      const metrics = {
        timestamp: new Date(),
        uptime: process.uptime(),
        memory: {
          usage: process.memoryUsage(),
          system: os.freemem() / os.totalmem()
        },
        cpu: {
          usage: process.cpuUsage(),
          system: os.loadavg()
        },
        db: await this.getDbStatus(),
        redis: await this.getRedisStatus(),
        checks: ++this.metrics.checks
      };

      this.checkThresholds(metrics);
      return metrics;
    } catch (error) {
      logger.error('Monitoring error:', error);
      this.metrics.errors++;
    }
  }

  async getDbStatus() {
    try {
      const adminDb = mongoose.connection.db.admin();
      const ping = await adminDb.ping();
      const stats = await mongoose.connection.db.stats();
      
      return {
        status: ping.ok ? 'healthy' : 'unhealthy',
        collections: stats.collections,
        connections: mongoose.connections.length
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async getRedisStatus() {
    try {
      const ping = await redis.ping();
      return {
        status: ping === 'PONG' ? 'healthy' : 'unhealthy'
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  checkThresholds(metrics) {
    if (metrics.memory.system > this.thresholds.memory) {
      logger.warn(`High memory usage: ${(metrics.memory.system * 100).toFixed(2)}%`);
    }
    
    if (metrics.cpu.system[0] > this.thresholds.cpu * os.cpus().length) {
      logger.warn(`High CPU load: ${metrics.cpu.system[0].toFixed(2)}`);
    }
  }

  async healthCheck() {
    const metrics = await this.collectMetrics();
    const isHealthy = 
      metrics.db.status === 'healthy' && 
      metrics.redis.status === 'healthy' &&
      metrics.memory.system < this.thresholds.memory;
    
    return {
      isHealthy,
      metrics
    };
  }
}

module.exports = new MonitoringService();
