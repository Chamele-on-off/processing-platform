const amqp = require('amqplib');
const logger = require('../utils/logger');

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = {};
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      logger.info('RabbitMQ connected');

      this.connection.on('error', (err) => {
        logger.error('RabbitMQ connection error:', err);
      });

      this.connection.on('close', () => {
        logger.warn('RabbitMQ connection closed');
      });

      this.channel = await this.connection.createChannel();
      return this;
    } catch (error) {
      logger.error('RabbitMQ connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.channel.close();
      await this.connection.close();
      logger.info('RabbitMQ disconnected');
    } catch (error) {
      logger.error('RabbitMQ disconnection failed:', error);
      throw error;
    }
  }

  async assertQueue(queueName, options = { durable: true }) {
    try {
      if (!this.queues[queueName]) {
        await this.channel.assertQueue(queueName, options);
        this.queues[queueName] = true;
        logger.info(`Queue ${queueName} asserted`);
      }
      return this;
    } catch (error) {
      logger.error(`Queue assertion failed for ${queueName}:`, error);
      throw error;
    }
  }

  async sendToQueue(queueName, message) {
    try {
      const msgBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.sendToQueue(queueName, msgBuffer);
      logger.debug(`Message sent to ${queueName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send message to ${queueName}:`, error);
      throw error;
    }
  }

  async consume(queueName, callback) {
    try {
      await this.channel.consume(queueName, async (msg) => {
        try {
          if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            logger.debug(`Message received from ${queueName}`);
            await callback(content);
            this.channel.ack(msg);
          }
        } catch (error) {
          logger.error(`Message processing failed for ${queueName}:`, error);
          this.channel.nack(msg);
        }
      });
      logger.info(`Consumer started for ${queueName}`);
      return this;
    } catch (error) {
      logger.error(`Failed to start consumer for ${queueName}:`, error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      if (!this.connection) {
        throw new Error('No connection established');
      }
      return { status: 'up' };
    } catch (error) {
      logger.error('RabbitMQ health check failed:', error);
      return { status: 'down', error };
    }
  }
}

module.exports = new RabbitMQ();
