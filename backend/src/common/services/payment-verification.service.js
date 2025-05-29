const Transaction = require('../models/transaction.model');
const Order = require('../models/order.model');
const logger = require('../utils/logger');
const rabbitmq = require('../config/rabbitmq');

class PaymentVerificationService {
  async init() {
    // Подписываемся на очередь проверки платежей
    await rabbitmq.assertQueue('payment_verification');
    await rabbitmq.consume('payment_verification', this.processPayment.bind(this));
    logger.info('Payment verification service started');
  }

  async processPayment(paymentData) {
    try {
      const { orderId, verificationData } = paymentData;
      
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Проверяем платеж через банковский API
      const isVerified = await this.verifyBankPayment(
        order.trader.paymentDetails,
        order.amount,
        verificationData
      );

      if (isVerified) {
        await this.completeOrder(order);
      } else {
        await this.failOrder(order);
      }
    } catch (error) {
      logger.error('Payment processing failed:', error);
    }
  }

  async verifyBankPayment(paymentDetails, amount, verificationData) {
    // Реальная интеграция с банком должна быть здесь
    // Это упрощенная реализация
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          verificationData.amount >= amount && 
          verificationData.status === 'completed'
        );
      }, 1000);
    });
  }

  async completeOrder(order) {
    order.status = 'completed';
    order.completedAt = new Date();
    await order.save();

    // Создаем транзакцию
    const transaction = new Transaction({
      order: order._id,
      merchant: order.merchant,
      trader: order.trader,
      amount: order.amount,
      currency: order.currency,
      type: 'deposit',
      status: 'completed'
    });

    await transaction.save();

    // Обновляем статистику трейдера
    await this.updateTraderStats(order.trader, true);
  }

  async failOrder(order) {
    order.status = 'failed';
    await order.save();
    await this.updateTraderStats(order.trader, false);
  }

  async updateTraderStats(traderId, isSuccess) {
    const update = isSuccess
      ? { $inc: { 'traderDetails.successfulTransactions': 1 } }
      : { $inc: { 'traderDetails.failedTransactions': 1 } };

    await User.findByIdAndUpdate(traderId, update);
  }
}

module.exports = new PaymentVerificationService();
