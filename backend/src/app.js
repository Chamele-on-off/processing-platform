const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./common/utils/error-handler');
const logger = require('./common/utils/logger');
const config = require('./common/config');

const app = express();

// 1. Global Middlewares
app.use(helmet());
app.use(cors({
  origin: config.env === 'development' ? '*' : config.baseUrl,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.api.rateLimit.windowMs,
  max: config.api.rateLimit.max,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(hpp());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// 2. Routes
app.use(`${config.api.prefix}/${config.api.version}/admin`, require('./admin/routes/admin.routes'));
app.use(`${config.api.prefix}/${config.api.version}/trader`, require('./trader/routes/trader.routes'));
app.use(`${config.api.prefix}/${config.api.version}/merchant`, require('./merchant/routes/merchant.routes'));
app.use(`${config.api.prefix}/${config.api.version}/merchant_api`, require('./merchant/routes/api.routes'));

// 3. Health checks
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Processing Platform API is running',
    timestamp: new Date()
  });
});

// 4. Error handling
app.use(errorHandler);

// 5. 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;
