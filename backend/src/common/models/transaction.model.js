const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  merchant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trader: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'RUB' },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'disputed', 'resolved', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank', 'card', 'crypto', 'ewallet', 'internal'],
    required: true
  },
  paymentDetails: {
    accountNumber: String,
    bankName: String,
    cryptoWallet: String,
    ewalletProvider: String
  },
  proofUrl: String,
  processingStartedAt: Date,
  completedAt: Date,
  disputeDetails: {
    reason: String,
    evidence: [String],
    resolution: String,
    resolvedAmount: Number,
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date
  },
  ipAddress: String,
  userAgent: String,
  geoData: {
    country: String,
    city: String,
    isProxy: Boolean,
    isVpn: Boolean
  },
  metadata: Schema.Types.Mixed
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы для быстрого поиска
TransactionSchema.index({ merchant: 1, status: 1 });
TransactionSchema.index({ trader: 1, status: 1 });
TransactionSchema.index({ createdAt: 1 });
TransactionSchema.index({ amount: 1 });

// Виртуальные поля
TransactionSchema.virtual('processingTime').get(function() {
  if (this.processingStartedAt && this.completedAt) {
    return (this.completedAt - this.processingStartedAt) / 1000; // в секундах
  }
  return null;
});

module.exports = mongoose.model('Transaction', TransactionSchema);
