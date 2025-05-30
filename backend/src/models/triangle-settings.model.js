import mongoose from 'mongoose';

const TriangleSettingsSchema = new mongoose.Schema({
  autoMatchingEnabled: {
    type: Boolean,
    default: true
  },
  minAmount: {
    type: Number,
    default: 1000
  },
  maxAmount: {
    type: Number,
    default: 50000
  },
  allowedPaymentMethods: [{
    type: String,
    enum: ['card', 'qiwi', 'yoomoney', 'sbp', 'crypto']
  }],
  efficiencyThreshold: {
    type: Number,
    default: 85
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model('TriangleSettings', TriangleSettingsSchema);
