const winston = require('winston');
const { combine, timestamp, printf, errors, json } = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');
const { env, isProduction } = require('../config');

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const transports = [
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: combine(timestamp(), errors({ stack: true }), json())
  ),
  new DailyRotateFile({
    level: 'error',
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '90d',
    format: combine(timestamp(), errors({ stack: true }), json())
  )
];

if (!isProduction) {
  transports.push(new winston.transports.Console({
    format: combine(
      winston.format.colorize(),
      timestamp(),
      errors({ stack: true }),
      logFormat
    )
  }));
}

const logger = winston.createLogger({
  level: env === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true
    })
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true
    })
  ]
});

// For morgan HTTP logs
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;
