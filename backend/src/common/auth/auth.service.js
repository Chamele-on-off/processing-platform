const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtExpiresIn, refreshTokenSecret } = require('../../config');
const logger = require('../utils/logger');
const { ForbiddenError, ValidationError, AuthError } = require('../utils/error-handler');

// Коды ошибок
const ERROR_CODES = {
  INVALID_CREDENTIALS: 'AUTH/INVALID_CREDENTIALS',
  ACCOUNT_INACTIVE: 'AUTH/ACCOUNT_INACTIVE',
  EMAIL_IN_USE: 'AUTH/EMAIL_IN_USE',
  INVALID_REFRESH_TOKEN: 'AUTH/INVALID_REFRESH_TOKEN',
  INSUFFICIENT_PERMISSIONS: 'AUTH/INSUFFICIENT_PERMISSIONS'
};

module.exports = {
  async authenticateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthError('Invalid credentials', ERROR_CODES.INVALID_CREDENTIALS);
    }

    if (user.status !== 'active') {
      throw new AuthError('Account is not active', ERROR_CODES.ACCOUNT_INACTIVE);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthError('Invalid credentials', ERROR_CODES.INVALID_CREDENTIALS);
    }

    const token = this.generateAuthToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Сохраняем refresh токен в базу
    user.refreshToken = refreshToken;
    await user.save();

    return { 
      user: this.sanitizeUser(user),
      token, 
      refreshToken 
    };
  },

  async registerUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ValidationError('Email already in use', ERROR_CODES.EMAIL_IN_USE);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = new User({
      ...userData,
      password: hashedPassword,
      status: 'pending',
      role: userData.role || 'user'
    });

    await user.save();
    return this.sanitizeUser(user);
  },

  async refreshAuthToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, refreshTokenSecret);
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new AuthError('Invalid refresh token', ERROR_CODES.INVALID_REFRESH_TOKEN);
      }

      const token = this.generateAuthToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      return { 
        user: this.sanitizeUser(user),
        token, 
        refreshToken: newRefreshToken 
      };
    } catch (err) {
      throw new AuthError('Invalid refresh token', ERROR_CODES.INVALID_REFRESH_TOKEN);
    }
  },

  async revokeToken(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  },

  async verifyRole(userId, requiredRole) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    if (user.role !== requiredRole) {
      throw new ForbiddenError(
        `Required role: ${requiredRole}`,
        ERROR_CODES.INSUFFICIENT_PERMISSIONS
      );
    }

    return true;
  },

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AuthError('User not found');
    }
    return this.sanitizeUser(user);
  },

  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    return userObj;
  },

  generateAuthToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );
  },

  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      refreshTokenSecret,
      { expiresIn: '30d' }
    );
  }
};
