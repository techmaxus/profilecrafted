import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../config/.env') });

export const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost',
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  },

  // File Upload Settings
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['.pdf', '.docx'],
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },

  // Analysis Configuration
  analysis: {
    processingDelay: process.env.NODE_ENV === 'development' ? 2000 : 0,
    scoreRange: { min: 70, max: 100 },
    categories: [
      { key: 'technicalFluency', label: 'Technical Fluency', weight: 0.2 },
      { key: 'productThinking', label: 'Product Thinking', weight: 0.25 },
      { key: 'curiosityCreativity', label: 'Curiosity & Creativity', weight: 0.2 },
      { key: 'communicationClarity', label: 'Communication Clarity', weight: 0.2 },
      { key: 'leadershipTeamwork', label: 'Leadership & Teamwork', weight: 0.15 },
    ],
    defaultTips: {
      technicalFluency: "Highlight specific programming languages and frameworks you've used",
      productThinking: "Include examples of product decisions you've influenced",
      curiosityCreativity: "Showcase side projects or innovative solutions you've built",
      communicationClarity: "Use clear, concise language and quantify your achievements",
      leadershipTeamwork: "Describe collaborative projects and leadership experiences"
    },
  },

  // Essay Generation
  essay: {
    processingDelay: process.env.NODE_ENV === 'development' ? 3000 : 0,
    targetWordCount: 400,
    template: {
      companyName: 'Perplexity',
      position: 'Associate Product Manager',
    },
  },

  // Email Configuration
  email: {
    enabled: process.env.ENABLE_EMAIL === 'true',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
    from: process.env.FROM_EMAIL || 'noreply@profilecrafted.com',
  },

  // Features
  features: {
    emailDelivery: process.env.ENABLE_EMAIL === 'true',
    mockApiDelay: process.env.MOCK_API_DELAY === 'true',
  },

  // Development
  development: {
    enableDebugLogs: process.env.NODE_ENV === 'development',
  },
};
