const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/api-response');
const logger = require('../../utils/logger');

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.authenticateUser(email, password);
      
      successResponse(res, 'Login successful', {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        token
      });
    } catch (error) {
      logger.error('Login failed:', error);
      errorResponse(res, 'Invalid credentials', null, 401);
    }
  },

  async register(req, res) {
    try {
      const userData = req.body;
      const user = await authService.registerUser(userData);
      
      successResponse(res, 'Registration successful', {
        id: user._id,
        email: user.email,
        role: user.role
      }, 201);
    } catch (error) {
      logger.error('Registration failed:', error);
      errorResponse(res, 'Registration failed', error);
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const { token, newRefreshToken } = await authService.refreshAuthToken(refreshToken);
      
      successResponse(res, 'Token refreshed', {
        token,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      logger.error('Token refresh failed:', error);
      errorResponse(res, 'Invalid refresh token', null, 401);
    }
  },

  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      await authService.revokeToken(token);
      
      successResponse(res, 'Logout successful');
    } catch (error) {
      logger.error('Logout failed:', error);
      errorResponse(res, 'Logout failed', error);
    }
  },

  async getCurrentUser(req, res) {
    try {
      const user = await authService.getUserById(req.user.id);
      
      successResponse(res, 'User retrieved', {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        status: user.status
      });
    } catch (error) {
      logger.error('Failed to get user:', error);
      errorResponse(res, 'Failed to get user', error);
    }
  }
};
