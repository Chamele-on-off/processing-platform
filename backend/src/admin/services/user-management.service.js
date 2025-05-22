const User = require('../../../common/models/user.model');
const { ROLES } = require('../../../common/utils/constants');
const logger = require('../../../common/utils/logger');

module.exports = {
  async createUser(userData) {
    try {
      // Валидация роли
      if (!ROLES.includes(userData.role)) {
        throw new Error('Invalid user role');
      }

      // Проверка на существующего пользователя
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = new User({
        ...userData,
        status: 'active',
        emailVerified: false
      });

      await user.save();

      // Логирование создания пользователя
      logger.info(`User created: ${user.email} with role ${user.role}`);

      return user;
    } catch (error) {
      logger.error('Failed to create user:', error);
      throw error;
    }
  },

  async updateUser(userId, updates) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Запрещаем обновление некоторых полей
      const { password, email, createdAt, ...safeUpdates } = updates;

      // Специальная обработка для трейдеров
      if (user.role === 'trader') {
        if (safeUpdates.hasOwnProperty('maxTransactionLimit')) {
          // Дополнительная проверка лимита
        }
      }

      Object.assign(user, safeUpdates);
      await user.save();

      return user;
    } catch (error) {
      logger.error(`Failed to update user ${userId}:`, error);
      throw error;
    }
  },

  async changeUserStatus(userId, status) {
    try {
      const validStatuses = ['active', 'suspended', 'banned'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      // Дополнительные действия при изменении статуса
      if (status === 'suspended') {
        await this.revokeActiveSessions(userId);
      }

      return user;
    } catch (error) {
      logger.error(`Failed to change status for user ${userId}:`, error);
      throw error;
    }
  },

  async revokeActiveSessions(userId) {
    // Реализация отзыва сессий через Redis
    // ...
  },

  async getUsersWithFilters(filters) {
    try {
      const { role, status, search, page = 1, limit = 20 } = filters;

      const query = {};
      if (role) query.role = role;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .skip((page - 1) * limit)
          .limit(limit),
        User.countDocuments(query)
      ]);

      return {
        users,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Failed to get users with filters:', error);
      throw error;
    }
  }
};
