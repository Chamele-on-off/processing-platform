const User = require('../../common/models/user.model');
const { successResponse, errorResponse } = require('../../common/utils/api-response');
const logger = require('../../common/utils/logger');

exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments(filter);

    successResponse(res, 'Users retrieved successfully', {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Failed to get users:', error);
    errorResponse(res, 'Failed to retrieve users', error);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User not found', null, 404);
    }
    successResponse(res, 'User retrieved successfully', user);
  } catch (error) {
    logger.error(`Failed to get user ${req.params.id}:`, error);
    errorResponse(res, 'Failed to retrieve user', error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Запрещаем обновление некоторых полей
    delete updates.password;
    delete updates.email;
    delete updates.createdAt;

    const user = await User.findByIdAndUpdate(id, updates, { 
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', null, 404);
    }

    successResponse(res, 'User updated successfully', user);
  } catch (error) {
    logger.error(`Failed to update user ${req.params.id}:`, error);
    errorResponse(res, 'Failed to update user', error);
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'banned'].includes(status)) {
      return errorResponse(res, 'Invalid status value', null, 400);
    }

    const user = await User.findByIdAndUpdate(
      id, 
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', null, 404);
    }

    // Дополнительные действия при изменении статуса
    if (status === 'suspended') {
      // Например, закрыть все активные сессии
    }

    successResponse(res, 'User status updated successfully', user);
  } catch (error) {
    logger.error(`Failed to update user status ${req.params.id}:`, error);
    errorResponse(res, 'Failed to update user status', error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', null, 404);
    }

    // Дополнительные действия при удалении пользователя
    // Например, архивирование связанных данных

    successResponse(res, 'User deleted successfully');
  } catch (error) {
    logger.error(`Failed to delete user ${req.params.id}:`, error);
    errorResponse(res, 'Failed to delete user', error);
  }
};
