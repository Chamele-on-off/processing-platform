const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

module.exports = {
  securityHeaders: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: { action: 'deny' },
    hidePoweredBy: true
  }),

  apiLimiter: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false
  }),

  sanitizeInput: (req, res, next) => {
    // Sanitize all incoming data
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitize(req.body[key]);
    });
    next();
  }
};
