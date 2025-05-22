const mongoose = require('mongoose');
const logger = require('../utils/logger');

module.exports = {
  connect: async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/processing', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 50
      });

      logger.info(`MongoDB connected: ${conn.connection.host}`);

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed due to app termination');
        process.exit(0);
      });
    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  },

  disconnect: async () => {
    try {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected');
    } catch (error) {
      logger.error('MongoDB disconnection failed:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      await mongoose.connection.db.admin().ping();
      return { status: 'up' };
    } catch (error) {
      logger.error('MongoDB health check failed:', error);
      return { status: 'down', error };
    }
  }
};
