const mongoose = require('mongoose');
const logger = require('../src/common/utils/logger');
const config = require('../src/common/config/production');

class ProductionMigrator {
  async run() {
    try {
      await mongoose.connect(config.db.uri, config.db.options);
      logger.info('Connected to production database for migrations');

      const db = mongoose.connection.db;
      
      // Production-specific migrations
      await this.createIndexes(db);
      await this.applyDataPatches(db);
      
      logger.info('Production migrations completed');
      process.exit(0);
    } catch (error) {
      logger.error('Production migration failed:', error);
      process.exit(1);
    }
  }

  async createIndexes(db) {
    logger.info('Creating production indexes...');
    
    await db.collection('transactions').createIndexes([
      { key: { merchant: 1, status: 1 } },
      { key: { trader: 1, status: 1 } },
      { key: { createdAt: 1 } },
      { key: { amount: 1 } }
    ]);
    
    await db.collection('orders').createIndexes([
      { key: { merchant: 1, status: 1 } },
      { key: { trader: 1, status: 1 } },
      { key: { priority: -1, createdAt: 1 } }
    ]);
  }

  async applyDataPatches(db) {
    // Example data patch
    await db.collection('users').updateMany(
      { 'traderDetails.insuranceDeposit': { $exists: false } },
      { $set: { 'traderDetails.insuranceDeposit': 0 } }
    );
  }
}

new ProductionMigrator().run();
