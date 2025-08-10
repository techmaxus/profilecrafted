/**
 * ProfileCrafted.com Production Server
 * Industry-standard security, real AI integration, encrypted credentials
 */

require('dotenv').config({ path: '../../config/.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const winston = require('winston');

// Production services
const productionConfig = require('./config/production');
const aiService = require('./services/aiService');
const emailService = require('./services/emailService');
const documentParser = require('./services/documentParser');
const credentialManager = require('./services/credentialManager');

// Security middleware
const {
  generalRateLimit,
  uploadRateLimit,
  essayRateLimit,
  emailRateLimit,
  uploadSpeedLimit,
  essaySpeedLimit,
  sanitizeInput,
  securityHeaders,
  requestLogger,
  errorHandler,
  fileUploadValidation,
  emailValidation,
  scoreValidation,
  validateRequest
} = require('./middleware/security');

// Initialize Express app
const app = express();

// Configure production logger
const logger = winston.createLogger({
  level: productionConfig.server.environment === 'production' ? 'warn' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/server.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ...(productionConfig.server.environment !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ] : [])
  ]
});

// Trust proxy for production deployment
if (productionConfig.security.trustProxy) {
  app.set('trust proxy', 1);
}

// Core middleware with production security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", productionConfig.server.frontendUrl]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(securityHeaders);
app.use(requestLogger);
app.use(compression({ threshold: 1024 }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:57551'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

app.use(express.json({ 
  limit: productionConfig.server.maxRequestSize,
  type: ['application/json', 'text/plain']
}));
app.use(express.urlencoded({ extended: true, limit: productionConfig.server.maxRequestSize }));

// Apply security middleware
app.use(sanitizeInput);
app.use(generalRateLimit);

// Configure secure file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = productionConfig.storage.uploadDir;
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const sessionId = credentialManager.generateSessionToken();
    const ext = path.extname(file.originalname);
    const filename = `resume_${sessionId}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: productionConfig.storage.maxFileSize,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (productionConfig.storage.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

// Production Routes with Security

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  const status = productionConfig.getProductionStatus();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: productionConfig.server.environment,
    services: status.services,
    version: process.env.npm_package_version || '1.0.0'
  });
});

/**
 * Production readiness check
 */
app.get('/api/status', (req, res) => {
  const readiness = productionConfig.validateProductionReadiness();
  res.json({
    ...readiness,
    config: productionConfig.getProductionStatus()
  });
});

/**
 * Secure file upload with real parsing
 */
app.post('/api/upload-resume', 
  uploadRateLimit,
  uploadSpeedLimit,
  upload.single('resume'),
  fileUploadValidation,
  validateRequest,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      logger.info(`File upload started: ${req.file.originalname}`, {
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      // Parse document content
      const parseResult = await documentParser.parseResume(req.file.path, req.file.originalname);
      
      // Generate session ID for tracking
      const sessionId = credentialManager.generateSessionToken();
      
      // Analyze resume with AI immediately after upload
      logger.info(`Starting AI analysis for session: ${sessionId}`);
      const analysis = await aiService.analyzeResume(parseResult.text);
      
      res.json({
        success: true,
        sessionId,
        message: 'Resume uploaded, parsed, and analyzed successfully',
        analysis: analysis,
        metadata: parseResult.metadata,
        textPreview: parseResult.text.substring(0, 200) + '...'
      });

      logger.info(`File upload completed: ${req.file.originalname}`, {
        sessionId,
        textLength: parseResult.text.length
      });

    } catch (error) {
      logger.error('File upload failed:', error);
      res.status(500).json({ 
        error: 'File upload failed',
        message: error.message 
      });
    }
  }
);

/**
 * Real AI-powered resume analysis
 */
app.post('/api/analyze',
  essayRateLimit,
  essaySpeedLimit,
  scoreValidation,
  validateRequest,
  async (req, res) => {
    try {
      const { sessionId, resumeText } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
      }

      logger.info(`Resume analysis started for session: ${sessionId}`);

      // Use real AI service for analysis
      const analysis = await aiService.analyzeResume(resumeText || '');

      res.json({
        success: true,
        sessionId,
        scores: analysis,
        provider: aiService.getAvailableProviders()[0] || 'mock',
        timestamp: new Date().toISOString()
      });

      logger.info(`Resume analysis completed for session: ${sessionId}`, {
        overallScore: analysis.overall,
        provider: aiService.getAvailableProviders()[0] || 'mock'
      });

    } catch (error) {
      logger.error('Resume analysis failed:', error);
      res.status(500).json({ 
        error: 'Analysis failed',
        message: error.message 
      });
    }
  }
);

/**
 * Real AI-powered essay generation
 */
app.post('/api/generate-essay',
  essayRateLimit,
  essaySpeedLimit,
  scoreValidation,
  validateRequest,
  async (req, res) => {
    try {
      const { scores, sessionId, resumeContent } = req.body;

      if (!scores || !sessionId) {
        return res.status(400).json({ error: 'Scores and session ID required' });
      }

      logger.info(`Essay generation started for session: ${sessionId}`);

      // Use real AI service for essay generation
      const essay = await aiService.generateEssay(scores, resumeContent || '');

      res.json({
        success: true,
        essay,
        sessionId,
        provider: aiService.getAvailableProviders()[0] || 'mock',
        wordCount: essay.split(/\s+/).length,
        timestamp: new Date().toISOString()
      });

      logger.info(`Essay generation completed for session: ${sessionId}`, {
        wordCount: essay.split(/\s+/).length,
        provider: aiService.getAvailableProviders()[0] || 'mock'
      });

    } catch (error) {
      logger.error('Essay generation failed:', error);
      res.status(500).json({ 
        error: 'Essay generation failed',
        message: error.message 
      });
    }
  }
);

/**
 * Essay regeneration (same as generation)
 */
app.post('/api/regenerate-essay',
  essayRateLimit,
  essaySpeedLimit,
  scoreValidation,
  validateRequest,
  async (req, res) => {
    try {
      const { scores, sessionId, resumeContent } = req.body;

      if (!scores || !sessionId) {
        return res.status(400).json({ error: 'Scores and session ID required' });
      }

      logger.info(`Essay regeneration started for session: ${sessionId}`);

      // Use real AI service for essay regeneration
      const essay = await aiService.generateEssay(scores, resumeContent || '');

      res.json({
        success: true,
        essay,
        sessionId,
        provider: aiService.getAvailableProviders()[0] || 'mock',
        wordCount: essay.split(/\s+/).length,
        timestamp: new Date().toISOString()
      });

      logger.info(`Essay regeneration completed for session: ${sessionId}`, {
        wordCount: essay.split(/\s+/).length,
        provider: aiService.getAvailableProviders()[0] || 'mock'
      });

    } catch (error) {
      logger.error('Essay regeneration failed:', error);
      res.status(500).json({ 
        error: 'Essay regeneration failed',
        message: error.message 
      });
    }
  }
);

/**
 * Production email delivery
 */
app.post('/api/send-email',
  emailRateLimit,
  emailValidation,
  validateRequest,
  async (req, res) => {
    try {
      const { email, essay, sessionId } = req.body;

      logger.info(`Email sending started for session: ${sessionId}`, {
        recipient: email
      });

      // Use real email service
      const result = await emailService.sendEssay(email, essay);

      res.json(result);

      logger.info(`Email sent successfully for session: ${sessionId}`, {
        recipient: email,
        mode: result.mode || 'production'
      });

    } catch (error) {
      logger.error('Email sending failed:', error);
      res.status(500).json({ 
        error: 'Email delivery failed',
        message: error.message 
      });
    }
  }
);

/**
 * Get AI prompt for debugging (development only)
 */
app.post('/api/get-prompt',
  generalRateLimit,
  scoreValidation,
  validateRequest,
  async (req, res) => {
    try {
      if (productionConfig.server.environment === 'production') {
        return res.status(403).json({ error: 'Endpoint not available in production' });
      }

      const { scores, resumeContent } = req.body;
      const { generateEssayPrompt } = require('./essayGenerator');
      
      const prompt = generateEssayPrompt(scores, resumeContent || '');
      
      res.json({
        success: true,
        prompt,
        note: 'Development endpoint - use this prompt with your AI service'
      });

    } catch (error) {
      logger.error('Prompt generation failed:', error);
      res.status(500).json({ 
        error: 'Prompt generation failed',
        message: error.message 
      });
    }
  }
);

// Global error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const PORT = productionConfig.server.port;
const HOST = productionConfig.server.host;

app.listen(PORT, HOST, () => {
  logger.info(`🚀 ProfileCrafted Production Server running`, {
    port: PORT,
    host: HOST,
    environment: productionConfig.server.environment,
    services: productionConfig.getProductionStatus().services
  });

  // Log production readiness
  const readiness = productionConfig.validateProductionReadiness();
  if (readiness.ready) {
    logger.info('✅ All production services ready');
  } else {
    logger.warn('⚠️ Production readiness issues:', readiness.issues);
  }
});

module.exports = app;
