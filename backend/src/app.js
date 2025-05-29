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
const auditMiddleware = require('./common/middlewares/audit.middleware');

// Инициализация Express приложения
const app = express();

// 1. Trust proxy для правильного определения IP за reverse proxy
app.set('trust proxy', true);

// 2. Global Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://*'],
      connectSrc: ["'self'", config.baseUrl]
    }
  },
  hsts: {
    maxAge: 63072000, // 2 года
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: config.cors.origins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: config.api.rateLimit.windowMs,
  max: config.api.rateLimit.max,
  message: 'Too many requests from this IP, please try again later',
  skip: (req) => {
    // Пропускаем лимит для health-check и важных API
    return req.path.includes('/health') || req.path.includes('/metrics');
  }
});

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(config.cookie.secret));

// Data sanitization
app.use(mongoSanitize());
app.use(hpp());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  
  next();
});

// 3. API Routes
const apiRouter = express.Router();

// Основные роуты API
apiRouter.use('/admin', require('./admin/routes/admin.routes'));
apiRouter.use('/trader', require('./trader/routes/trader.routes'));
apiRouter.use('/merchant', require('./merchant/routes/merchant.routes'));
apiRouter.use('/merchant_api', require('./merchant/routes/api.routes'));

// Аудитинг для всех API запросов
apiRouter.use(auditMiddleware('api_request', 'system'));

// Применяем лимитер только к API
apiRouter.use(apiLimiter);

// Основной префикс API
app.use(`${config.api.prefix}/${config.api.version}`, apiRouter);

// 4. Health checks и мониторинг
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: config.env
  });
});

app.get('/metrics', async (req, res) => {
  try {
    const metrics = {
      timestamp: new Date(),
      process: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime()
      },
      system: {
        loadavg: require('os').loadavg(),
        freemem: require('os').freemem()
      }
    };
    
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
});

// 5. Error handling
app.use(errorHandler);

// 6. 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;
