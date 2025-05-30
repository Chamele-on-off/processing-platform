import TransactionModel from '../models/transaction.model.js';
import TriangleTransactionModel from '../models/triangle-transaction.model.js';
import TriangleSettingsModel from '../models/triangle-settings.model.js';
import UserModel from '../models/user.model.js';
import ApiError from '../exceptions/api-error.js';
import MatchingAlgorithm from '../algorithms/matching.algorithm.js';
import NotificationService from './notification.service.js';
import FraudDetectionService from './fraud-detection.service.js';

class TriangleService {
  async getAllTransactions() {
    return TriangleTransactionModel.find()
      .populate('deposits')
      .populate('payout')
      .sort({ createdAt: -1 });
  }

  async getStats() {
    const [todayMatches, totalVolume] = await Promise.all([
      TriangleTransactionModel.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
        status: 'completed'
      }),
      TriangleTransactionModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    return {
      efficiency: await this.calculateEfficiency(),
      volume: totalVolume[0]?.total || 0,
      todayMatches
    };
  }

  async calculateEfficiency() {
    // Логика расчета эффективности матчинга
  }

  async confirmTransaction(id, userId) {
    const transaction = await TriangleTransactionModel.findByIdAndUpdate(
      id,
      { status: 'completed', processedBy: userId },
      { new: true }
    ).populate('deposits').populate('payout');

    if (!transaction) {
      throw ApiError.BadRequest('Транзакция не найдена');
    }

    // Пометить исходные транзакции как обработанные
    await TransactionModel.updateMany(
      { _id: { $in: transaction.deposits.map(d => d._id) } },
      { status: 'completed' }
    );

    await TransactionModel.findByIdAndUpdate(
      transaction.payout._id,
      { status: 'completed' }
    );

    // Отправить уведомления
    await NotificationService.create({
      userId,
      type: 'triangle_completed',
      data: { triangleId: transaction._id }
    });

    // Проверить на фрод
    await FraudDetectionService.checkTriangle(transaction);

    return transaction;
  }

  async createManualTransaction(depositIds, payoutId, userId) {
    // Валидация и создание ручной треугольной транзакции
  }

  async processAutoMatching() {
    const settings = await this.getSettings();
    if (!settings.autoMatchingEnabled) return;

    const matches = await MatchingAlgorithm.findMatches();
    for (const match of matches) {
      const triangleTx = new TriangleTransactionModel({
        deposits: match.depositIds,
        payout: match.payoutId,
        amount: match.amount,
        status: 'pending',
        autoMatched: true
      });

      await triangleTx.save();
      
      // Отправить уведомление через WebSocket
      WebSocketService.broadcast('admin', 'new_triangle', {
        transaction: await triangleTx.populate(['deposits', 'payout']),
        stats: await this.getStats()
      });
    }
  }
}

export default new TriangleService();
