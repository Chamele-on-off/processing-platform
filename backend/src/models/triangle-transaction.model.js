import mongoose from 'mongoose';

const TriangleTransactionSchema = new mongoose.Schema({
  deposits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  }],
  payout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'canceled'],
    default: 'pending'
  },
  autoMatched: {
    type: Boolean,
    default: false
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fee: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('TriangleTransaction', TriangleTransactionSchema);
