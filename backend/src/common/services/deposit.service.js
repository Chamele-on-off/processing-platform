const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/api-response');
const logger = require('../utils/logger');
const axios = require('axios');

class DepositService {
  async createDepositRequest(traderId, amount, currency, paymentDetails) {
    try {
      // Проверяем существующего трейдера
      const trader = await User.findById(traderId);
      if (!trader || trader.role !== 'trader') {
        throw new Error('Invalid trader');
      }

      // Создаем транзакцию депозита
      const deposit = new Transaction({
        type: 'trader_deposit',
        trader: traderId,
        amount,
        currency,
        paymentDetails,
        status: 'pending'
      });

      await deposit.save();

      // Обновляем баланс трейдера (зарезервированные средства)
      await User.findByIdAndUpdate(traderId, {
        $inc: { 'traderDetails.insuranceDeposit': amount }
      });

      return deposit;
    } catch (error) {
      logger.error(`Deposit creation failed for trader ${traderId}:`, error);
      throw error;
    }
  }

  async confirmDeposit(depositId, confirmationData) {
    try {
      const deposit = await Transaction.findById(depositId);
      if (!deposit) {
        throw new Error('Deposit not found');
      }

      // Здесь должна быть интеграция с API банка для подтверждения платежа
      const isConfirmed = await this.verifyBankConfirmation(
        deposit.paymentDetails,
        confirmationData
      );

      if (!isConfirmed) {
        throw new Error('Deposit confirmation failed');
      }

      // Обновляем статус депозита
      deposit.status = 'completed';
      deposit.completedAt = new Date();
      await deposit.save();

      // Активируем реквизиты трейдера
      await this.activateTraderDetails(deposit.trader);

      return deposit;
    } catch (error) {
      logger.error(`Deposit confirmation failed for ${depositId}:`, error);
      throw error;
    }
  }

  async verifyBankConfirmation(paymentDetails, confirmationData) {
    // Интеграция с API банка или SMS-парсером
    // Это упрощенная реализация, в реальности нужно подключать банковский API
    try {
      const response = await axios.post('https://bank-api.example.com/verify', {
        paymentDetails,
        confirmationData
      });
      return response.data.success;
    } catch (error) {
      logger.error('Bank verification failed:', error);
      return false;
    }
  }

  async activateTraderDetails(traderId) {
    await User.updateOne(
      { _id: traderId, 'paymentDetails.isActive': false },
      { $set: { 'paymentDetails.isActive': true } }
    );
  }
}

module.exports = new DepositService();
