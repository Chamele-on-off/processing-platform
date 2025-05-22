const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentDetailSchema = new Schema({
  trader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['bank_account', 'card', 'crypto', 'ewallet'],
    required: true
  },
  details: {
    accountNumber: String,
    bankName: String,
    cardNumber: String,
    cardHolder: String,
    expiryDate: String,
    cryptoWallet: String,
    cryptoCurrency: String,
    ewalletProvider: String,
    ewalletId: String
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationData: Schema.Types.Mixed,
  metadata: Schema.Types.Mixed
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы
PaymentDetailSchema.index({ trader: 1, isActive: 1 });
PaymentDetailSchema.index({ type: 1 });

// Валидация в зависимости от типа
PaymentDetailSchema.pre('save', function(next) {
  switch (this.type) {
    case 'bank_account':
      if (!this.details.accountNumber || !this.details.bankName) {
        throw new Error('Bank account details are incomplete');
      }
      break;
    case 'card':
      if (!this.details.cardNumber || !this.details.cardHolder || !this.details.expiryDate) {
        throw new Error('Card details are incomplete');
      }
      break;
    case 'crypto':
      if (!this.details.cryptoWallet || !this.details.cryptoCurrency) {
        throw new Error('Crypto wallet details are incomplete');
      }
      break;
    case 'ewallet':
      if (!this.details.ewalletProvider || !this.details.ewalletId) {
        throw new Error('E-wallet details are incomplete');
      }
      break;
  }
  next();
});

module.exports = mongoose.model('PaymentDetail', PaymentDetailSchema);
