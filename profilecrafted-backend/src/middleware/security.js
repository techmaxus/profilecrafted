/**
 * Production Security Middleware
 * Industry-standard security with rate limiting and validation
 */

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const { body, validationResult } = require('express-validator');
const winston = require('winston');

// Configure security logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

/**
 * Rate limiting for API endpoints
 */
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        endpoint: req.path,
        userAgent: req.get('User-Agent')
      });
      res.status(429).json({ error: message });
    }
  });
};

/**
 * Speed limiting for resource-intensive endpoints
 */
const createSpeedLimit = (windowMs, delayAfter, delayMs) => {
  return slowDown({
    windowMs,
    delayAfter,
    delayMs: () => delayMs,
    maxDelayMs: delayMs * 10,
    validate: { delayMs: false }
  });
};

/**
 * Input sanitization middleware
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize against NoSQL injection
  mongoSanitize()(req, res, () => {
    // Sanitize against XSS
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = xss(req.body[key]);
        }
      });
    }
    next();
  });
};

/**
 * Request validation middleware
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed:', {
      errors: errors.array(),
      ip: req.ip,
      endpoint: req.path
    });
    return res.status(400).json({
      error: 'Invalid request data',
      details: errors.array()
    });
  }
  next();
};

/**
 * File upload validation rules
 */
const fileUploadValidation = [
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error('Invalid file type. Only PDF and DOCX files are allowed');
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB');
    }
    
    return true;
  })
];

/**
 * Email validation rules
 */
const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('essay')
    .isLength({ min: 50, max: 2000 })
    .withMessage('Essay must be between 50 and 2000 characters')
];

/**
 * Score validation rules
 */
const scoreValidation = [
  body('scores.overall').isInt({ min: 0, max: 100 }).withMessage('Overall score must be 0-100'),
  body('scores.technicalFluency').isInt({ min: 0, max: 100 }).withMessage('Technical fluency score must be 0-100'),
  body('scores.productThinking').isInt({ min: 0, max: 100 }).withMessage('Product thinking score must be 0-100'),
  body('scores.curiosityCreativity').isInt({ min: 0, max: 100 }).withMessage('Curiosity creativity score must be 0-100'),
  body('scores.communicationClarity').isInt({ min: 0, max: 100 }).withMessage('Communication clarity score must be 0-100'),
  body('scores.leadershipTeamwork').isInt({ min: 0, max: 100 }).withMessage('Leadership teamwork score must be 0-100')
];

/**
 * Security headers middleware
 */
const securityHeaders = (req, res, next) => {
  // Additional security headers beyond helmet
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
};

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

/**
 * Error handling middleware
 */
const errorHandler = (error, req, res, next) => {
  logger.error('Request error:', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: req.ip
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    error: isDevelopment ? error.message : 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
};

module.exports = {
  // Rate limiting
  generalRateLimit: createRateLimit(15 * 60 * 1000, 100, 'Too many requests, please try again later'),
  uploadRateLimit: createRateLimit(15 * 60 * 1000, 10, 'Too many file uploads, please try again later'),
  essayRateLimit: createRateLimit(15 * 60 * 1000, 20, 'Too many essay requests, please try again later'),
  emailRateLimit: createRateLimit(60 * 60 * 1000, 5, 'Too many email requests, please try again later'),
  
  // Speed limiting
  uploadSpeedLimit: createSpeedLimit(15 * 60 * 1000, 5, 1000),
  essaySpeedLimit: createSpeedLimit(15 * 60 * 1000, 10, 2000),
  
  // Validation
  fileUploadValidation,
  emailValidation,
  scoreValidation,
  validateRequest,
  
  // Security
  sanitizeInput,
  securityHeaders,
  requestLogger,
  errorHandler
};
