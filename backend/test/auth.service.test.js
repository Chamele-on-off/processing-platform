const { expect } = require('chai');
const sinon = require('sinon');
const authService = require('../src/common/auth/auth.service');
const User = require('../src/common/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Auth Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('authenticateUser', () => {
    it('should throw error for non-existent user', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      
      try {
        await authService.authenticateUser('nonexistent@test.com', 'password');
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err.message).to.equal('Invalid credentials');
      }
    });

    it('should return tokens for valid credentials', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        password: await bcrypt.hash('password', 10),
        status: 'active',
        save: sinon.stub().resolves()
      };

      sinon.stub(User, 'findOne').resolves(mockUser);
      sinon.stub(jwt, 'sign').returns('mockToken');

      const result = await authService.authenticateUser('test@test.com', 'password');
      
      expect(result).to.have.property('token');
      expect(result).to.have.property('refreshToken');
      expect(mockUser.save.calledOnce).to.be.true;
    });
  });

  // Дополнительные тесты для других методов...
});
