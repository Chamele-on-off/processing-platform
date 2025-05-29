const User = require('../models/user.model');
const Order = require('../models/order.model');
const { successResponse, errorResponse } = require('../utils/api-response');
const logger = require('../utils/logger');
const redis = require('../config/redis');
const { v4: uuidv4 } = require('uuid');

class RequisitesService {
  async init() {
    try {
      // Очистка старых резерваций при старте
      const keys = await redis.keys('req_reserve:*');
      if (keys.length > 0) {
        await redis.del(keys);
      }
      logger.info('Requisites service initialized');
    } catch (error) {
      logger.error('Requisites service initialization failed:', error);
      throw error;
    }
  }

  async getAvailableRequisite(merchantId, amount, currency = 'RUB', paymentMethod = 'bank_account') {
    try {
      // Получаем активных трейдеров с подходящими реквизитами
      const traders = await User.aggregate([
        {
          $match: {
            role: 'trader',
            status: 'active',
            'paymentDetails.isActive': true,
            'paymentDetails.type': paymentMethod,
            'traderDetails.insuranceDeposit': { $gte: amount * 1.1 } // +10% буфер
          }
        },
        { $sample: { size: 10 } } // Берем случайных 10 трейдеров
      ]);

      if (traders.length === 0) {
        throw new Error('No available traders');
      }

      // Выбираем лучшего трейдера по рейтингу и скорости обработки
      const selectedTrader = traders.sort((a, b) => 
        b.traderDetails.rating - a.traderDetails.rating ||
        b.traderDetails.conversionRate - a.traderDetails.conversionRate
      )[0];

      // Создаем временную резервацию в Redis
      const reservationKey = `req_reserve:${uuidv4()}`;
      await redis.set(
        reservationKey, 
        JSON.stringify({ 
          merchantId, 
          amount, 
          currency,
          paymentMethod,
          traderId: selectedTrader._id,
          timestamp: Date.now()
        }),
        'EX', 
        900 // 15 минут TTL
      );

      return {
        traderId: selectedTrader._id,
        paymentDetails: selectedTrader.paymentDetails,
        reservationKey,
        expiresAt: Date.now() + 900000,
        amount,
        currency
      };
    } catch (error) {
      logger.error('Requisite selection failed:', error);
      throw error;
    }
  }

  async createOrderFromReservation(reservationKey, clientData) {
    try {
      // Получаем данные резервации
      const reservation = await redis.get(reservationKey);
      if (!reservation) {
        throw new Error('Reservation expired or invalid');
      }

      const { merchantId, amount, currency, traderId, paymentMethod } = JSON.parse(reservation);

      // Создаем ордер
      const order = new Order({
        merchant: merchantId,
        trader: traderId,
        type: 'deposit',
        amount,
        currency,
        paymentMethod,
        status: 'pending',
        clientData,
        reservationKey
      });

      await order.save();
      await redis.del(reservationKey);

      // Отправляем уведомление трейдеру
      await this.notifyTrader(traderId, order._id);

      return order;
    } catch (error) {
      logger.error('Order creation from reservation failed:', error);
      throw error;
    }
  }

  async notifyTrader(traderId, orderId) {
    try {
      // В реальной системе здесь будет интеграция с WebSocket или push-уведомлениями
      logger.info(`Notification sent to trader ${traderId} about order ${orderId}`);
      
      // Обновляем время последней активности трейдера
      await User.findByIdAndUpdate(traderId, {
        $set: { 'traderDetails.lastActivity': new Date() }
      });
    } catch (error) {
      logger.error('Trader notification failed:', error);
      throw error;
    }
  }

  async cancelReservation(reservationKey) {
    try {
      const result = await redis.del(reservationKey);
      return result === 1;
    } catch (error) {
      logger.error('Reservation cancellation failed:', error);
      throw error;
    }
  }
}

module.exports = new RequisitesService();
