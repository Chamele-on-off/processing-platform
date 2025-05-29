const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: { 
    type: String, 
    required: true,
    select: false
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  role: { 
    type: String, 
    required: true,
    enum: ['admin', 'trader', 'merchant'],
    default: 'merchant'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'pending'],
    default: 'pending'
  },
  refreshToken: {
    type: String,
    select: false
  },
  lastLogin: Date,
  loginIp: String,
  profile: {
    phone: String,
    address: String,
    company: String,
    taxId: String
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      telegram: { type: Boolean, default: false }
    },
    twoFactorAuth: { type: Boolean, default: false }
  },
  // Для трейдеров
  traderDetails: {
    maxTransactionLimit: { type: Number, default: 100000 },
    processingSpeed: { type: Number, default: 1 },
    rating: { type: Number, min: 0, max: 5, default: 3 },
    insuranceDeposit: { type: Number, default: 0 },
    successfulTransactions: { type: Number, default: 0 },
    failedTransactions: { type: Number, default: 0 },
    conversionRate: { 
      type: Number, 
      default: 0,
      set: function() {
        const total = this.successfulTransactions + this.failedTransactions;
        return total > 0 
          ? Math.round((this.successfulTransactions / total) * 100) 
          : 0;
      }
    },
    lastActivity: Date,
    averageProcessingTime: Number // в секундах
  },
  // Для мерчантов
  merchantDetails: {
    businessType: String,
    processingRates: {
      deposit: { type: Number, default: 0.05 }, // 5%
      withdrawal: { type: Number, default: 0.02 } // 2%
    },
    balance: {
      available: { type: Number, default: 0 },
      pending: { type: Number, default: 0 }
    },
    apiKeys: [{
      key: String,
      secret: String,
      created: { type: Date, default: Date.now },
      lastUsed: Date
    }]
  },
  paymentDetails: {
    type: { 
      type: String, 
      enum: ['bank_account', 'card', 'crypto', 'ewallet', null],
      default: null
    },
    details: Schema.Types.Mixed,
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
  }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Хеширование пароля перед сохранением
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Метод для проверки пароля
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Виртуальные поля
UserSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// Обновление рейтинга трейдера
UserSchema.methods.updateTraderRating = async function() {
  if (this.role !== 'trader') return;
  
  const successRate = this.traderDetails.conversionRate / 100;
  const activityScore = this.traderDetails.lastActivity 
    ? (new Date() - this.traderDetails.lastActivity) / (1000 * 60 * 60 * 24)
    : 0;
  
  // Простая формула расчета рейтинга
  this.traderDetails.rating = Math.min(
    5,
    2.5 + 
    (successRate * 2) + 
    (Math.max(0, 1 - activityScore / 30)) // Чем свежее активность, тем выше
  );
  
  await this.save();
};

// Индексы
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ 'traderDetails.rating': -1 });
UserSchema.index({ 'paymentDetails.isActive': 1 });

module.exports = mongoose.model('User', UserSchema);
