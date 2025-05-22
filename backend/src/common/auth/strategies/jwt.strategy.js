const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../../../models/user.model');
const { jwtSecret } = require('../../../../config');
const logger = require('../../../utils/logger');

const options = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true
};

module.exports = new JwtStrategy(options, async (req, payload, done) => {
  try {
    const user = await User.findById(payload.id);
    
    if (!user) {
      return done(null, false);
    }

    if (user.status !== 'active') {
      return done(null, false, { message: 'Account is not active' });
    }

    // Добавляем пользователя в запрос для последующих middleware
    req.user = user;
    return done(null, user);
  } catch (error) {
    logger.error('JWT strategy error:', error);
    return done(error, false);
  }
});
