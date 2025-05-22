const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../../../models/user.model');
const bcrypt = require('bcryptjs');
const logger = require('../../../utils/logger');

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      if (user.status !== 'active') {
        return done(null, false, { message: 'Account is not active' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (error) {
      logger.error('Local strategy error:', error);
      return done(error);
    }
  }
);
