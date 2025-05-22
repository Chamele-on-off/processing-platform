const Transaction = require('../../../models/transaction.model');
const logger = require('../../../utils/logger');

module.exports = {
  async check(transaction) {
    try {
      const anomalies = [];
      
      // Проверка 1: Необычно большая сумма
      if (await this.isUnusualAmount(transaction.trader, transaction.amount)) {
        anomalies.push('unusual_transaction_amount');
      }

      // Проверка 2: Необычная частота транзакций
      if (await this.isUnusualFrequency(transaction.trader)) {
        anomalies.push('unusual_transaction_frequency');
      }

      // Проверка 3: Подозрительное время операции
      if (this.isUnusualTime(transaction.createdAt)) {
        anomalies.push('unusual_transaction_time');
      }

      return anomalies;
    } catch (error) {
      logger.error('Transaction patterns rule check failed:', error);
      return [];
    }
  },

  async isUnusualAmount(traderId, amount) {
    // Получаем среднюю сумму транзакций трейдера
    const stats = await Transaction.aggregate([
      { $match: { trader: traderId } },
      { $group: { _id: null, avgAmount: { $avg: "$amount" } } }
    ]);
    
    const avgAmount = stats[0]?.avgAmount || 0;
    return amount > avgAmount * 3; // Сумма в 3 раза больше средней
  },

  async isUnusualFrequency(traderId) {
    // Количество транзакций за последний час
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);
    const count = await Transaction.countDocuments({
      trader: traderId,
      createdAt: { $gte: lastHour }
    });
    
    return count > 10; // Более 10 транзакций в час
  },

  isUnusualTime(transactionTime) {
    const hour = new Date(transactionTime).getHours();
    // Подозрительное время - между 2 и 5 утра
    return hour >= 2 && hour <= 5;
  }
};
