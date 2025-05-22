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
      sms: { type: Boolean, default: false }
    },
    twoFactorAuth: { type: Boolean, default: false }
  },
  // Для трейдеров
  traderDetails: {
    maxTransactionLimit: Number,
    processingSpeed: Number,
    rating: { type: Number, min: 0, max: 5 },
    insuranceDeposit: Number
  },
  // Для мерчантов
  merchantDetails: {
    businessType: String,
    processingRates: {
      deposit: Number,
      withdrawal: Number
    },
    balance: {
      available: { type: Number, default: 0 },
      pending: { type: Number, default: 0 }
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
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

// Виртуальные поля и методы
UserSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

module.exports = mongoose.model('User', UserSchema);
