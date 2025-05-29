const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const logger = require('../utils/logger');
const axios = require('axios');

class DepositService {
  async checkPendingDeposits() {
    try {
      const pendingDeposits = await Transaction.find({
        type: 'trader_deposit',
        status: 'pending',
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      for (const deposit of pendingDeposits) {
        await this.processDeposit(deposit);
      }
      
      logger.info(`Processed ${pendingDeposits.length} pending deposits`);
    } catch (error) {
      logger.error('Pending deposits check failed:', error);
    }
  }

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

      // Проверяем подтверждение платежа
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

  async cancelDeposit(depositId) {
    try {
      const deposit = await Transaction.findByIdAndUpdate(
        depositId,
        { status: 'cancelled' },
        { new: true }
      );
      
      if (deposit && deposit.trader) {
        await User.findByIdAndUpdate(deposit.trader, {
          $inc: { 'traderDetails.insuranceDeposit': -deposit.amount }
        });
      }
      
      return deposit;
    } catch (error) {
      logger.error(`Deposit cancellation failed for ${depositId}:`, error);
      throw error;
    }
  }

  async processDeposit(deposit) {
    try {
      // Логика обработки депозита
      const isConfirmed = await this.mockBankConfirmation(deposit);
      
      if (isConfirmed) {
        await this.confirmDeposit(deposit._id, {});
      } else {
        await this.cancelDeposit(deposit._id);
      }
    } catch (error) {
      logger.error(`Deposit processing failed for ${deposit._id}:`, error);
    }
  }

  async verifyBankConfirmation(paymentDetails, confirmationData) {
    try {
      // Интеграция с API банка или SMS-парсером
      // Это упрощенная реализация, в реальности нужно подключать банковский API
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

  async mockBankConfirmation(deposit) {
    // В реальной системе здесь будет вызов банковского API
    return Math.random() > 0.2; // 80% вероятность успеха для теста
  }

  async activateTraderDetails(traderId) {
    try {
      await User.updateOne(
        { _id: traderId },
        { 
          $set: { 
            'paymentDetails.isActive': true,
            'paymentDetails.isVerified': true 
          } 
        }
      );
      logger.info(`Trader ${traderId} details activated`);
    } catch (error) {
      logger.error(`Trader details activation failed for ${traderId}:`, error);
      throw error;
    }
  }
}

module.exports = new DepositService();
