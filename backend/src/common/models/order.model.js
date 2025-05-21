const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  merchant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trader: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'RUB' },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'processing', 'completed', 'disputed', 'cancelled'],
    default: 'pending'
  },
  priority: { type: Number, default: 1 },
  paymentDetails: { type: Schema.Types.ObjectId, ref: 'PaymentDetail' },
  pdfProof: { type: String },
  disputeReason: { type: String },
  processedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Индексы для быстрого поиска
OrderSchema.index({ merchant: 1, status: 1 });
OrderSchema.index({ trader: 1, status: 1 });
OrderSchema.index({ createdAt: 1 });
OrderSchema.index({ priority: -1, createdAt: 1 });

module.exports = mongoose.model('Order', OrderSchema);
