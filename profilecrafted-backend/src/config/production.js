/**
 * Production Configuration with Encrypted Credential Management
 * Industry-standard security and environment management
 */

require('dotenv').config({ path: '../config/.env' });
const credentialManager = require('../services/credentialManager');
const winston = require('winston');

// Configure production logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ] : [])
  ]
});

class ProductionConfig {
  constructor() {
    this.validateEnvironment();
    this.initializeConfig();
  }

  /**
   * Validate required environment variables
   */
  validateEnvironment() {
    const required = [
      'NODE_ENV',
      'PORT',
      'FRONTEND_URL',
      'ENCRYPTION_KEY'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    logger.info('Environment validation passed');
  }

  /**
   * Initialize production configuration
   */
  initializeConfig() {
    this.server = {
      port: parseInt(process.env.PORT) || 3001,
      host: process.env.HOST || '0.0.0.0',
      environment: process.env.NODE_ENV || 'development',
      frontendUrl: process.env.FRONTEND_URL,
      maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb'
    };

    this.security = {
      encryptionKey: process.env.ENCRYPTION_KEY,
      sessionSecret: process.env.SESSION_SECRET || credentialManager.generateSessionToken(),
      corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [this.server.frontendUrl],
      trustProxy: process.env.TRUST_PROXY === 'true'
    };

    this.ai = {
      openaiKey: process.env.OPENAI_API_KEY,
      anthropicKey: process.env.ANTHROPIC_API_KEY,
      googleAiKey: process.env.GOOGLE_AI_API_KEY,
      defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'openai',
      timeout: parseInt(process.env.AI_TIMEOUT) || 30000,
      maxRetries: parseInt(process.env.AI_MAX_RETRIES) || 3
    };

    this.email = {
      enabled: process.env.ENABLE_EMAIL === 'true',
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.FROM_EMAIL,
      replyTo: process.env.REPLY_TO_EMAIL
    };

    this.storage = {
      type: process.env.STORAGE_TYPE || 'local',
      uploadDir: process.env.UPLOAD_DIR || './uploads',
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
      allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      // AWS S3 configuration
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        bucket: process.env.AWS_S3_BUCKET
      }
    };

    this.database = {
      enabled: process.env.ENABLE_DATABASE === 'true',
      uri: process.env.MONGODB_URI || process.env.DATABASE_URL,
      options: {
        maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
        serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT) || 5000,
        socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT) || 45000
      }
    };

    this.monitoring = {
      sentryDsn: process.env.SENTRY_DSN,
      googleAnalytics: process.env.GA_TRACKING_ID,
      enableMetrics: process.env.ENABLE_METRICS === 'true',
      healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000
    };

    this.features = {
      enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
      enableCaching: process.env.ENABLE_CACHING === 'true',
      enableCompression: process.env.ENABLE_COMPRESSION !== 'false',
      enableSocialSharing: process.env.ENABLE_SOCIAL_SHARING !== 'false',
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true'
    };

    logger.info('Production configuration initialized', {
      environment: this.server.environment,
      aiProviders: this.getAvailableAIProviders(),
      emailEnabled: this.email.enabled,
      databaseEnabled: this.database.enabled
    });
  }

  /**
   * Get available AI providers
   */
  getAvailableAIProviders() {
    const providers = [];
    if (this.ai.openaiKey) providers.push('OpenAI');
    if (this.ai.anthropicKey) providers.push('Anthropic');
    if (this.ai.googleAiKey) providers.push('Google AI');
    return providers;
  }

  /**
   * Get secure API key with validation
   */
  getSecureApiKey(keyName) {
    return credentialManager.getSecureApiKey(keyName);
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(featureName) {
    return this.features[featureName] === true;
  }

  /**
   * Get production status
   */
  getProductionStatus() {
    return {
      environment: this.server.environment,
      isProduction: this.server.environment === 'production',
      services: {
        ai: this.getAvailableAIProviders().length > 0,
        email: this.email.enabled && this.email.host,
        database: this.database.enabled && this.database.uri,
        storage: this.storage.type,
        monitoring: !!this.monitoring.sentryDsn
      },
      security: {
        encryptionEnabled: !!this.security.encryptionKey,
        corsConfigured: this.security.corsOrigins.length > 0,
        rateLimitingEnabled: true
      }
    };
  }

  /**
   * Validate production readiness
   */
  validateProductionReadiness() {
    const issues = [];

    // Check critical services
    if (this.getAvailableAIProviders().length === 0) {
      issues.push('No AI providers configured');
    }

    if (!this.email.enabled || !this.email.host) {
      issues.push('Email service not configured');
    }

    if (this.server.environment === 'production') {
      if (!this.security.encryptionKey) {
        issues.push('Encryption key not set');
      }
      
      if (!this.monitoring.sentryDsn) {
        issues.push('Error monitoring not configured');
      }
    }

    return {
      ready: issues.length === 0,
      issues
    };
  }
}

module.exports = new ProductionConfig();
