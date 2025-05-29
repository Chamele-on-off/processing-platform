const logger = require('../utils/logger');

class SmsParserService {
  constructor() {
    this.patterns = {
      sber: /(?<amount>\d+\.?\d*)р\. (?<card>\*\d{4})/,
      tinkoff: /Пополнение (?<amount>\d+\.?\d*) руб (?<card>\*\d{4})/,
      alfabank: /Зачисление (?<amount>\d+\.?\d*) RUB на карту (?<card>\*\d{4})/
    };
  }

  parseSms(bankName, smsText) {
    try {
      const pattern = this.patterns[bankName];
      if (!pattern) {
        throw new Error('Unsupported bank');
      }

      const match = smsText.match(pattern);
      if (!match) {
        return null;
      }

      return {
        amount: parseFloat(match.groups.amount),
        card: match.groups.card,
        bank: bankName
      };
    } catch (error) {
      logger.error('SMS parsing failed:', error);
      return null;
    }
  }

  async verifyPayment(paymentDetails, smsText) {
    const parsed = this.parseSms(paymentDetails.bankName, smsText);
    if (!parsed) {
      return false;
    }

    return (
      parsed.amount >= paymentDetails.amount &&
      parsed.card === paymentDetails.cardNumber
    );
  }
}

module.exports = new SmsParserService();
