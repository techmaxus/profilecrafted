/**
 * ProfileCrafted.com Application Configuration
 * 
 * This file centralizes all configuration settings for easy management.
 * Update values here instead of hardcoding throughout the application.
 */

const config = {
  // Application Settings
  app: {
    name: 'ProfileCrafted',
    version: '1.0.0',
    description: 'APM Resume Analysis and Essay Generation Tool',
    author: 'ProfileCrafted Team',
    website: 'https://profilecrafted.com',
  },

  // Server Configuration
  server: {
    // Backend API Configuration
    backend: {
      port: process.env.PORT || 3001,
      host: process.env.HOST || 'localhost',
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      },
    },
    
    // Frontend Configuration
    frontend: {
      port: 3000,
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    },
  },

  // File Upload Settings
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB in bytes
    allowedTypes: ['.pdf', '.docx'],
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    uploadDir: './uploads',
    tempDir: './temp',
  },

  // Resume Analysis Configuration
  analysis: {
    // Mock analysis settings (replace with real AI service)
    processingDelay: 2000, // 2 seconds simulation
    scoreRange: {
      min: 70,
      max: 100,
    },
    categories: [
      {
        key: 'technicalFluency',
        label: 'Technical Fluency',
        color: 'bg-accent-blue',
        weight: 0.2,
      },
      {
        key: 'productThinking',
        label: 'Product Thinking',
        color: 'bg-accent-green',
        weight: 0.25,
      },
      {
        key: 'curiosityCreativity',
        label: 'Curiosity & Creativity',
        color: 'bg-accent-purple',
        weight: 0.2,
      },
      {
        key: 'communicationClarity',
        label: 'Communication Clarity',
        color: 'bg-accent-orange',
        weight: 0.2,
      },
      {
        key: 'leadershipTeamwork',
        label: 'Leadership & Teamwork',
        color: 'bg-pink-500',
        weight: 0.15,
      },
    ],
    defaultTips: {
      technicalFluency: "Highlight specific programming languages and frameworks you've used",
      productThinking: "Include examples of product decisions you've influenced",
      curiosityCreativity: "Showcase side projects or innovative solutions you've built",
      communicationClarity: "Use clear, concise language and quantify your achievements",
      leadershipTeamwork: "Describe collaborative projects and leadership experiences"
    },
  },

  // Essay Generation Configuration
  essay: {
    // AI essay generation settings
    processingDelay: process.env.NODE_ENV === 'development' ? 3000 : 0,
    targetWordCount: 400,
    wordCountRange: {
      min: 350,
      max: 450,
    },
    
    // Company-specific configuration
    company: {
      name: 'Perplexity',
      position: 'Associate Product Manager',
      mission: "organizing the world's information and making it universally accessible through innovative AI-powered solutions",
    },
    
    // Professional essay generation prompt
    prompt: {
      systemRole: "You are an expert career storyteller and product management hiring advisor.",
      
      task: "Your task is to create a compelling ~400-word written response for the Perplexity Associate Product Manager (APM) program application.",
      
      requirements: [
        "Be around 400 words (±5%)",
        "Be written in a confident yet humble first-person tone",
        "Highlight the candidate's accomplishments and skills directly relevant to the Perplexity APM criteria",
        "Show curiosity, creativity, technical fluency, product thinking, and leadership",
        "Maintain clarity, strong structure, and engaging flow",
        "Avoid bullet points — use cohesive paragraphs",
        "Do NOT repeat the same point in different words",
        "Do NOT make up achievements not present in the provided data"
      ],
      
      apmCriteria: [
        "Exceptional talent from traditional or unconventional backgrounds",
        "Self-starter with high standards, work ethic, and creativity",
        "Insatiable curiosity and tinkerer's spirit",
        "Strong AI product user with technical understanding",
        "Excellent communication, problem definition, and planning skills",
        "Ability to collaborate effectively with top engineers and diverse teams",
        "Leadership with humility and enthusiasm"
      ],
      
      instructions: [
        "Focus more on [candidate's strongest categories from scoring module]",
        "Maintain a narrative that aligns naturally with Perplexity's mission and culture",
        "Conclude with a future-facing statement about contributing to Perplexity's AI products"
      ],
      
      template: `{systemRole}

{task}

The output must:
{requirements}

Perplexity APM Program Key Criteria:
{apmCriteria}

Additional Notes:
{instructions}

Candidate Data:
- Overall APM Fit Score: {overallScore}/100
- Technical Fluency: {technicalFluency}/100
- Product Thinking: {productThinking}/100
- Curiosity & Creativity: {curiosityCreativity}/100
- Communication Clarity: {communicationClarity}/100
- Leadership & Teamwork: {leadershipTeamwork}/100

Strongest Categories: {strongestCategories}

Resume Content: {resumeContent}

Generate a compelling, personalized essay based on this data.`
    },
  },

  // Email Configuration
  email: {
    // SMTP Settings (configure with your email service)
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '', // Your email
        pass: process.env.SMTP_PASS || '', // Your email password or app password
      },
    },
    
    // Email Templates
    templates: {
      essayDelivery: {
        subject: 'Your ProfileCrafted APM Essay',
        from: process.env.FROM_EMAIL || 'noreply@profilecrafted.com',
        template: `
          <h2>Your APM Application Essay</h2>
          <p>Here's your personalized essay generated by ProfileCrafted:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            {essayContent}
          </div>
          <p>Good luck with your application!</p>
          <p>Best regards,<br>The ProfileCrafted Team</p>
        `,
      },
    },
  },

  // Social Media Sharing
  social: {
    shareText: "Just crafted my APM application essay with ProfileCrafted.com! 🚀",
    hashtags: ['#APM', '#ProductManager', '#CareerGrowth', '#ProfileCrafted'],
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

  // UI/UX Configuration
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
      fonts: {
        primary: 'Inter, system-ui, sans-serif',
      },
    },
    
    animations: {
      fadeInDuration: '0.5s',
      slideUpDuration: '0.3s',
      pulseSlowDuration: '2s',
    },
    
    breakpoints: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1280px',
    },
  },

  // Analytics & Monitoring (Optional)
  analytics: {
    googleAnalytics: {
      trackingId: process.env.GA_TRACKING_ID || '',
      enabled: process.env.NODE_ENV === 'production',
    },
    
    errorTracking: {
      sentryDsn: process.env.SENTRY_DSN || '',
      enabled: process.env.NODE_ENV === 'production',
    },
  },

  // Security Settings
  security: {
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
    
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
        },
      },
    },
  },

  // Feature Flags
  features: {
    emailDelivery: process.env.ENABLE_EMAIL === 'true',
    socialSharing: true,
    analytics: process.env.NODE_ENV === 'production',
    fileUploadProgress: true,
    realTimeWordCount: true,
    essayRegeneration: true,
  },

  // Development Settings
  development: {
    enableDebugLogs: process.env.NODE_ENV === 'development',
    mockApiDelay: true,
    skipFileValidation: false,
    enableHotReload: true,
  },
};

// Export configuration
module.exports = config;

// For ES6 modules
export default config;
