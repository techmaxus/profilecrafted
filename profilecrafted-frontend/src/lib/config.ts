/**
 * Frontend Configuration
 * Centralized configuration for the ProfileCrafted frontend
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    endpoints: {
      uploadResume: '/api/upload-resume',
      generateEssay: '/api/generate-essay',
      regenerateEssay: '/api/regenerate-essay',
      sendEmail: '/api/send-email',
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
  },

  // UI Configuration
  ui: {
    theme: {
      colors: {
        darkBg: '#0a0a0a',
        darkCard: '#1a1a1a',
        darkBorder: '#2a2a2a',
        darkText: '#ffffff',
        darkTextSecondary: '#a0a0a0',
        accentBlue: '#3b82f6',
        accentGreen: '#10b981',
        accentPurple: '#8b5cf6',
        accentOrange: '#f59e0b',
      },
    },
    
    animations: {
      fadeInDuration: 500,
      slideUpDuration: 300,
    },
    
    progressSteps: ['upload', 'analysis', 'essay', 'export'] as const,
  },

  // Essay Configuration
  essay: {
    targetWordCount: 400,
    wordCountRange: {
      min: 350,
      max: 450,
    },
  },

  // Social Sharing
  social: {
    shareText: "Just crafted my APM application essay with ProfileCrafted.com! 🚀",
    platforms: {
      twitter: {
        baseUrl: 'https://twitter.com/intent/tweet',
        enabled: true,
      },
      linkedin: {
        baseUrl: 'https://www.linkedin.com/sharing/share-offsite/',
        enabled: true,
      },
      facebook: {
        baseUrl: 'https://www.facebook.com/sharer/sharer.php',
        enabled: true,
      },
    },
  },

  // App Information
  app: {
    name: 'ProfileCrafted',
    description: 'APM Resume Analysis and Essay Generation Tool',
    version: '1.0.0',
    website: 'https://profilecrafted.com',
  },

  // Feature Flags
  features: {
    socialSharing: true,
    emailDelivery: true,
    realTimeWordCount: true,
    essayRegeneration: true,
    downloadEssay: true,
  },
};
