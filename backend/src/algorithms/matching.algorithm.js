import TransactionModel from '../models/transaction.model.js';
import TriangleSettingsModel from '../models/triangle-settings.model.js';

class MatchingAlgorithm {
  static async findMatches() {
    const settings = await TriangleSettingsModel.findOne();
    const payoutTxs = await this.getPayoutTransactions(settings);
    const depositTxs = await this.getDepositTransactions(settings);

    const matches = [];
    
    for (const payout of payoutTxs) {
      const matchedDeposits = [];
      let remainingAmount = payout.amount;
      
      for (const deposit of depositTxs) {
        if (deposit.amount <= remainingAmount && 
            this.isCompatible(payout, deposit, settings)) {
          matchedDeposits.push(deposit._id);
          remainingAmount -= deposit.amount;
          
          if (remainingAmount <= 0) break;
        }
      }

      if (matchedDeposits.length > 0 && remainingAmount <= payout.amount * 0.1) {
        matches.push({
          payoutId: payout._id,
          depositIds: matchedDeposits,
          amount: payout.amount - remainingAmount
        });
      }
    }

    return matches;
  }

  static async getPayoutTransactions(settings) {
    return TransactionModel.find({
      type: 'payout',
      status: 'pending',
      amount: { $gte: settings.minAmount, $lte: settings.maxAmount },
      paymentMethod: { $in: settings.allowedPaymentMethods }
    }).sort({ amount: -1 });
  }

  static async getDepositTransactions(settings) {
    return TransactionModel.find({
      type: 'deposit',
      status: 'pending',
      amount: { $gte: settings.minAmount },
      paymentMethod: { $in: settings.allowedPaymentMethods }
    }).sort({ createdAt: 1 });
  }

  static isCompatible(payout, deposit, settings) {
    // Дополнительные проверки совместимости
    return true;
  }
}

export default MatchingAlgorithm;
