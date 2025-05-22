const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtExpiresIn, refreshTokenSecret } = require('../../../config');
const logger = require('../../utils/logger');

module.exports = {
  async authenticateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateAuthToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Сохраняем refresh токен в базу
    user.refreshToken = refreshToken;
    await user.save();

    return { user, token, refreshToken };
  },

  async registerUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      ...userData,
      password: hashedPassword,
      status: 'active'
    });

    await user.save();
    return user;
  },

  async refreshAuthToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const token = this.generateAuthToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    // Обновляем refresh токен в базе
    user.refreshToken = newRefreshToken;
    await user.save();

    return { token, newRefreshToken };
  },

  async revokeToken(token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch (error) {
      logger.error('Token revocation failed:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
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
