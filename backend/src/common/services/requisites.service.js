const User = require('../models/user.model');
const Order = require('../models/order.model');
const { successResponse, errorResponse } = require('../utils/api-response');
const logger = require('../utils/logger');
const redis = require('../config/redis');

class RequisitesService {
  async getAvailableRequisite(merchantId, amount, currency = 'RUB') {
    try {
      // Получаем активных трейдеров с подходящими реквизитами
      const traders = await User.aggregate([
        {
          $match: {
            role: 'trader',
            status: 'active',
            'paymentDetails.isActive': true,
            'paymentDetails.type': 'bank_account',
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
        b.traderDetails.rating - a.traderDetails.rating
      )[0];

      // Создаем временную резервацию в Redis
      const reservationKey = `req_reserve:${selectedTrader._id}:${Date.now()}`;
      await redis.set(
        reservationKey, 
        JSON.stringify({ merchantId, amount, currency }),
        'EX', 
        900 // 15 минут TTL
      );

      return {
        traderId: selectedTrader._id,
        paymentDetails: selectedTrader.paymentDetails,
        reservationKey,
        expiresAt: Date.now() + 900000
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
        throw new Error('Reservation expired');
      }

      const { merchantId, amount, currency } = JSON.parse(reservation);

      // Создаем ордер
      const order = new Order({
        merchant: merchantId,
        trader: reservation.traderId,
        type: 'deposit',
        amount,
        currency,
        status: 'pending',
        clientData,
        reservationKey
      });

      await order.save();
      await redis.del(reservationKey);

      // Отправляем уведомление трейдеру
      this.notifyTrader(order.trader, order._id);

      return order;
    } catch (error) {
      logger.error('Order creation from reservation failed:', error);
      throw error;
    }
  }

  async notifyTrader(traderId, orderId) {
    // Реализация через WebSocket или push-уведомления
    // В реальном проекте нужно подключить систему нотификаций
    logger.info(`Notification sent to trader ${traderId} about order ${orderId}`);
  }
}

module.exports = new RequisitesService();
