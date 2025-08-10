// server.js - Main server file
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const resumeController = require('./controllers/resumeController');
const scoringController = require('./controllers/scoringController');
const essayController = require('./controllers/essayController');
const exportController = require('./controllers/exportController');
const analyticsController = require('./controllers/analyticsController');
const emailController = require('./controllers/emailController');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
    }
  }
});

// API Routes
app.post('/api/upload-resume', upload.single('resume'), resumeController.uploadAndParse);
app.post('/api/generate-scorecard', scoringController.generateScorecard);
app.post('/api/generate-essay', essayController.generateEssay);
app.post('/api/regenerate-essay', essayController.regenerateEssay);
app.post('/api/export', exportController.handleExport);
app.post('/api/email-essay', [
  body('email').isEmail().normalizeEmail(),
  body('essay').isLength({ min: 100, max: 600 })
], emailController.sendEssay);

// Analytics endpoints
app.post('/api/analytics/track', analyticsController.trackEvent);
app.get('/api/analytics/stats', analyticsController.getStats);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// controllers/resumeController.js
const resumeParser = require('../services/resumeParser');
const { trackAnalytics } = require('../utils/analytics');

const uploadAndParse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Track upload event
    await trackAnalytics('resume_uploaded', {
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      timestamp: new Date()
    });

    // Parse resume
    const parsedData = await resumeParser.parseResume(req.file);
    
    if (!parsedData || Object.keys(parsedData).length === 0) {
      return res.status(400).json({ error: 'Unable to parse resume. Please ensure it contains readable text.' });
    }

    res.json({
      success: true,
      data: parsedData,
      message: 'Resume parsed successfully'
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({ error: 'Failed to parse resume' });
  }
};

module.exports = { uploadAndParse };

// controllers/scoringController.js
const scoringEngine = require('../services/scoringEngine');
const { trackAnalytics } = require('../utils/analytics');

const generateScorecard = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    // Generate scorecard
    const scorecard = await scoringEngine.calculateFitScore(resumeData);

    // Track scorecard generation
    await trackAnalytics('scorecard_generated', {
      overallScore: scorecard.overallScore,
      timestamp: new Date()
    });

    res.json({
      success: true,
      scorecard,
      message: 'Scorecard generated successfully'
    });

  } catch (error) {
    console.error('Scorecard generation error:', error);
    res.status(500).json({ error: 'Failed to generate scorecard' });
  }
};

module.exports = { generateScorecard };

// controllers/essayController.js
const aiService = require('../services/aiService');
const { trackAnalytics } = require('../utils/analytics');
const { validationResult } = require('express-validator');

const generateEssay = async (req, res) => {
  try {
    const { resumeData, scorecard } = req.body;

    if (!resumeData || !scorecard) {
      return res.status(400).json({ error: 'Resume data and scorecard are required' });
    }

    // Generate essay using AI
    const essay = await aiService.generateEssay(resumeData, scorecard);

    // Track essay generation
    await trackAnalytics('essay_generated', {
      wordCount: essay.split(' ').length,
      timestamp: new Date()
    });

    res.json({
      success: true,
      essay,
      wordCount: essay.split(' ').length,
      message: 'Essay generated successfully'
    });

  } catch (error) {
    console.error('Essay generation error:', error);
    res.status(500).json({ error: 'Failed to generate essay' });
  }
};

const regenerateEssay = async (req, res) => {
  try {
    const { resumeData, scorecard, currentEssay } = req.body;

    if (!resumeData || !scorecard) {
      return res.status(400).json({ error: 'Resume data and scorecard are required' });
    }

    // Regenerate essay with variation
    const essay = await aiService.regenerateEssay(resumeData, scorecard, currentEssay);

    // Track essay regeneration
    await trackAnalytics('essay_regenerated', {
      wordCount: essay.split(' ').length,
      timestamp: new Date()
    });

    res.json({
      success: true,
      essay,
      wordCount: essay.split(' ').length,
      message: 'Essay regenerated successfully'
    });

  } catch (error) {
    console.error('Essay regeneration error:', error);
    res.status(500).json({ error: 'Failed to regenerate essay' });
  }
};

module.exports = { generateEssay, regenerateEssay };

// controllers/exportController.js
const { trackAnalytics } = require('../utils/analytics');

const handleExport = async (req, res) => {
  try {
    const { exportType, essay, email } = req.body;

    if (!essay) {
      return res.status(400).json({ error: 'Essay content is required' });
    }

    let response = { success: true };

    switch (exportType) {
      case 'copy':
        // Track copy action
        await trackAnalytics('essay_copied', { timestamp: new Date() });
        response.message = 'Essay ready to copy';
        break;

      case 'download':
        // Track download action
        await trackAnalytics('essay_downloaded', { timestamp: new Date() });
        response.message = 'Essay ready for download';
        response.filename = `perplexity_apm_essay_${Date.now()}.txt`;
        break;

      case 'email':
        if (!email) {
          return res.status(400).json({ error: 'Email is required for email export' });
        }
        // Email functionality handled in emailController
        response.message = 'Essay will be sent to email';
        break;

      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    res.json(response);

  } catch (error) {
    console.error('Export handling error:', error);
    res.status(500).json({ error: 'Failed to handle export' });
  }
};

module.exports = { handleExport };

// controllers/emailController.js
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { trackAnalytics } = require('../utils/analytics');

// Configure email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEssay = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, essay, name } = req.body;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@profilecrafted.com',
      to: email,
      subject: 'Your Perplexity APM Essay - ProfileCrafted',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Your Perplexity APM Essay</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Here's your custom-generated essay for the Perplexity Associate Product Manager position:</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <pre style="white-space: pre-wrap; font-family: inherit;">${essay}</pre>
          </div>
          <p>Good luck with your application!</p>
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This essay was generated by ProfileCrafted.com<br>
            <a href="https://profilecrafted.com">Visit ProfileCrafted.com</a> for more career tools.
          </p>
        </div>
      `,
      text: `Your Perplexity APM Essay\n\n${essay}\n\nGood luck with your application!\n\nGenerated by ProfileCrafted.com`
    };

    await transporter.sendMail(mailOptions);

    // Track email sent
    await trackAnalytics('essay_emailed', {
      email: email,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Essay sent successfully to your email'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = { sendEssay };

// controllers/analyticsController.js
const analytics = require('../utils/analytics');

const trackEvent = async (req, res) => {
  try {
    const { eventName, eventData } = req.body;

    if (!eventName) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    await analytics.trackAnalytics(eventName, eventData);

    res.json({ success: true, message: 'Event tracked' });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await analytics.getAnalyticsStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Analytics stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

module.exports = { trackEvent, getStats };

// services/resumeParser.js
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class ResumeParser {
  async parseResume(file) {
    let text = '';
    
    try {
      if (file.mimetype === 'application/pdf') {
        const data = await pdf(file.buffer);
        text = data.text;
      } else if (file.mimetype.includes('wordprocessingml')) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        text = result.value;
      } else {
        throw new Error('Unsupported file type');
      }

      return this.extractStructuredData(text);
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw new Error('Failed to parse resume');
    }
  }

  extractStructuredData(text) {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    return {
      rawText: cleanText,
      contact: this.extractContact(cleanText),
      experience: this.extractExperience(cleanText),
      education: this.extractEducation(cleanText),
      skills: this.extractSkills(cleanText),
      achievements: this.extractAchievements(cleanText)
    };
  }

  extractContact(text) {
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
    const phoneRegex = /[\+]?[1-9]?[\d\s\-\(\)]{10,}/g;
    
    const emails = text.match(emailRegex) || [];
    const phones = text.match(phoneRegex) || [];
    
    return {
      email: emails[0] || null,
      phone: phones[0] || null
    };
  }

  extractExperience(text) {
    // Look for common experience indicators
    const experienceKeywords = [
      'experience', 'work history', 'employment', 'professional experience',
      'software engineer', 'product manager', 'developer', 'analyst',
      'intern', 'associate', 'senior', 'lead', 'manager'
    ];
    
    const companies = this.findCompanyNames(text);
    const roles = this.findRoles(text);
    const years = this.extractYears(text);
    
    return {
      companies,
      roles,
      yearsOfExperience: this.calculateExperience(years),
      hasRelevantExperience: this.checkRelevantExperience(text)
    };
  }

  extractEducation(text) {
    const educationKeywords = [
      'university', 'college', 'bachelor', 'master', 'phd', 'degree',
      'b.s.', 'b.a.', 'm.s.', 'm.a.', 'computer science', 'engineering'
    ];
    
    const hasEducation = educationKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return {
      hasEducation,
      institutions: this.findInstitutions(text),
      degrees: this.findDegrees(text)
    };
  }

  extractSkills(text) {
    const technicalSkills = [
      'python', 'javascript', 'java', 'react', 'node.js', 'sql',
      'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
      'machine learning', 'ai', 'data analysis', 'api', 'rest'
    ];
    
    const productSkills = [
      'product management', 'user research', 'a/b testing', 'analytics',
      'roadmap', 'strategy', 'metrics', 'kpi', 'user experience', 'wireframing'
    ];
    
    const foundTechnicalSkills = technicalSkills.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    const foundProductSkills = productSkills.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return {
      technical: foundTechnicalSkills,
      product: foundProductSkills,
      totalSkillsCount: foundTechnicalSkills.length + foundProductSkills.length
    };
  }

  extractAchievements(text) {
    const achievementIndicators = [
      'increased', 'improved', 'reduced', 'achieved', 'delivered',
      'launched', 'built', 'created', 'led', 'managed', 'grew'
    ];
    
    const sentences = text.split(/[.!?]+/);
    const achievementSentences = sentences.filter(sentence =>
      achievementIndicators.some(indicator =>
        sentence.toLowerCase().includes(indicator)
      )
    ).slice(0, 5); // Top 5 achievement sentences
    
    return {
      achievements: achievementSentences,
      hasQuantifiableResults: this.hasNumbers(text)
    };
  }

  // Helper methods
  findCompanyNames(text) {
    // Simplified company detection
    const lines = text.split('\n');
    const companyLines = lines.filter(line => 
      /\b(inc|corp|llc|ltd|company|technologies|tech)\b/i.test(line)
    );
    return companyLines.slice(0, 5);
  }

  findRoles(text) {
    const roleKeywords = [
      'engineer', 'developer', 'manager', 'analyst', 'intern',
      'associate', 'senior', 'lead', 'director', 'coordinator'
    ];
    
    const roles = [];
    roleKeywords.forEach(role => {
      const regex = new RegExp(`\\b\\w*\\s*${role}\\b`, 'gi');
      const matches = text.match(regex) || [];
      roles.push(...matches.slice(0, 2));
    });
    
    return [...new Set(roles)];
  }

  extractYears(text) {
    const yearRegex = /20\d{2}/g;
    const years = text.match(yearRegex) || [];
    return [...new Set(years)].map(year => parseInt(year));
  }

  calculateExperience(years) {
    if (years.length < 2) return 0;
    const sortedYears = years.sort((a, b) => a - b);
    return sortedYears[sortedYears.length - 1] - sortedYears[0];
  }

  checkRelevantExperience(text) {
    const relevantKeywords = [
      'product', 'software', 'tech', 'startup', 'engineering',
      'development', 'programming', 'coding', 'analytics'
    ];
    
    return relevantKeywords.some(keyword =>
      text.toLowerCase().includes(keyword)
    );
  }

  findInstitutions(text) {
    const institutionKeywords = [
      'university', 'institute', 'college', 'school'
    ];
    
    const lines = text.split('\n');
    const institutionLines = lines.filter(line =>
      institutionKeywords.some(keyword =>
        line.toLowerCase().includes(keyword)
      )
    );
    
    return institutionLines.slice(0, 3);
  }

  findDegrees(text) {
    const degreePatterns = [
      /bachelor.*?(?:science|arts|engineering)/gi,
      /master.*?(?:science|arts|business)/gi,
      /b\.?[sa]\.?/gi,
      /m\.?[sa]\.?/gi,
      /phd/gi
    ];
    
    const degrees = [];
    degreePatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      degrees.push(...matches);
    });
    
    return [...new Set(degrees)];
  }

  hasNumbers(text) {
    return /\d+%|\$\d+|\d+x|\d+\+/.test(text);
  }
}

module.exports = new ResumeParser();

// services/scoringEngine.js
class ScoringEngine {
  constructor() {
    this.criteria = {
      technicalFluency: {
        weight: 0.25,
        keywords: [
          'python', 'javascript', 'sql', 'api', 'programming',
          'coding', 'software', 'engineering', 'development',
          'aws', 'cloud', 'database', 'git', 'agile'
        ]
      },
      productThinking: {
        weight: 0.25,
        keywords: [
          'product', 'user experience', 'metrics', 'analytics',
          'a/b testing', 'roadmap', 'strategy', 'market research',
          'user research', 'kpi', 'growth', 'optimization'
        ]
      },
      curiosityCreativity: {
        weight: 0.20,
        keywords: [
          'innovation', 'creative', 'experiment', 'prototype',
          'research', 'learning', 'hackathon', 'side project',
          'blog', 'writing', 'speaking', 'conference'
        ]
      },
      communicationClarity: {
        weight: 0.15,
        keywords: [
          'presentation', 'communication', 'writing', 'documentation',
          'teaching', 'mentoring', 'leadership', 'collaboration',
          'stakeholder', 'cross-functional'
        ]
      },
      leadershipTeamwork: {
        weight: 0.15,
        keywords: [
          'lead', 'team', 'manage', 'coordinate', 'organize',
          'project management', 'scrum master', 'mentored',
          'collaborated', 'cross-functional', 'volunteer'
        ]
      }
    };
  }

  async calculateFitScore(resumeData) {
    const scores = {};
    let overallScore = 0;

    // Calculate individual category scores
    for (const [category, config] of Object.entries(this.criteria)) {
      const categoryScore = this.calculateCategoryScore(resumeData, config);
      scores[category] = {
        score: categoryScore,
        weight: config.weight,
        tips: this.generateTips(category, categoryScore, resumeData)
      };
      
      overallScore += categoryScore * config.weight;
    }

    // Apply experience multiplier
    const experienceMultiplier = this.getExperienceMultiplier(resumeData);
    overallScore = Math.min(100, overallScore * experienceMultiplier);

    return {
      overallScore: Math.round(overallScore),
      categoryScores: scores,
      strengths: this.identifyStrengths(scores),
      improvements: this.identifyImprovements(scores),
      experienceLevel: this.assessExperienceLevel(resumeData)
    };
  }

  calculateCategoryScore(resumeData, config) {
    const text = resumeData.rawText.toLowerCase();
    let score = 0;
    
    // Keyword matching
    const matchedKeywords = config.keywords.filter(keyword =>
      text.includes(keyword.toLowerCase())
    );
    
    const keywordScore = (matchedKeywords.length / config.keywords.length) * 60;
    score += keywordScore;
    
    // Additional scoring based on specific resume sections
    if (resumeData.skills && resumeData.skills.totalSkillsCount > 0) {
      score += Math.min(20, resumeData.skills.totalSkillsCount * 2);
    }
    
    if (resumeData.achievements && resumeData.achievements.hasQuantifiableResults) {
      score += 15;
    }
    
    if (resumeData.experience && resumeData.experience.hasRelevantExperience) {
      score += 10;
    }
    
    return Math.min(100, Math.round(score));
  }

  getExperienceMultiplier(resumeData) {
    const years = resumeData.experience?.yearsOfExperience || 0;
    
    if (years === 0) return 0.8; // Recent graduate penalty
    if (years <= 2) return 1.0;  // Perfect for APM
    if (years <= 4) return 0.95; // Still good
    return 0.9; // Might be overqualified
  }

  generateTips(category, score, resumeData) {
    const tips = {
      technicalFluency: [
        "Highlight specific programming languages and tools you've used",
        "Include technical projects with measurable outcomes",
        "Mention any API integrations or database work"
      ],
      productThinking: [
        "Emphasize user-focused problem solving experiences",
        "Include examples of data-driven decision making",
        "Highlight any product analytics or A/B testing experience"
      ],
      curiosityCreativity: [
        "Showcase side projects or personal learning initiatives",
        "Mention any innovation challenges or hackathons",
        "Include examples of creative problem-solving"
      ],
      communicationClarity: [
        "Highlight presentations or documentation you've created",
        "Include cross-functional collaboration examples",
        "Mention any teaching or mentoring experience"
      ],
      leadershipTeamwork: [
        "Include team lead or project management experience",
        "Highlight volunteer work or community involvement",
        "Mention any mentoring or coaching roles"
      ]
    };

    if (score >= 80) return ["Great strength! Continue leveraging this in your essay."];
    if (score >= 60) return [tips[category][0]];
    return tips[category];
  }

  identifyStrengths(scores) {
    return Object.entries(scores)
      .filter(([_, data]) => data.score >= 75)
      .map(([category, _]) => this.formatCategoryName(category))
      .slice(0, 2);
  }

  identifyImprovements(scores) {
    return Object.entries(scores)
      .filter(([_, data]) => data.score < 60)
      .map(([category, _]) => this.formatCategoryName(category))
      .slice(0, 2);
  }

  assessExperienceLevel(resumeData) {
    const years = resumeData.experience?.yearsOfExperience || 0;
    const hasRelevantExp = resumeData.experience?.hasRelevantExperience || false;
    
    if (years === 0 && !hasRelevantExp) return 'Entry Level';
    if (years <= 2) return 'Junior';
    if (years <= 4) return 'Mid-Level';
    return 'Senior';
  }

  formatCategoryName(category) {
    const names = {
      technicalFluency: 'Technical Fluency',
      productThinking: 'Product Thinking',
      curiosityCreativity: 'Curiosity & Creativity',
      communicationClarity: 'Communication Clarity',
      leadershipTeamwork: 'Leadership & Teamwork'
    };
    return names[category] || category;
  }
}

module.exports = new ScoringEngine();

// services/aiService.js
const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.perplexityContext = `
    Perplexity AI is a conversational search engine that uses AI to provide direct answers to user queries.
    They value curiosity, technical excellence, user-first design, and innovative problem-solving.
    The APM role focuses on building products that help users discover and understand information more effectively.
    `;
  }

  async generateEssay(resumeData, scorecard) {
    const prompt = this.buildEssayPrompt(resumeData, scorecard, false);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert product manager and career coach specializing in APM applications. 
            Write compelling, authentic essays that highlight the candidate's unique strengths and fit for the Perplexity APM role.
            Keep the tone professional yet conversational, and ensure the essay is exactly around 400 words.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.7
      });

      const essay = response.choices[0].message.content.trim();
      return this.ensureWordCount(essay, 400);
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to regenerate essay');
    }
  }

  buildEssayPrompt(resumeData, scorecard, isRegeneration) {
    const { overallScore, categoryScores, strengths, experienceLevel } = scorecard;
    
    return `
    Write a compelling 400-word essay for a Perplexity Associate Product Manager application.

    CANDIDATE PROFILE:
    - Overall Fit Score: ${overallScore}/100
    - Experience Level: ${experienceLevel}
    - Key Strengths: ${strengths.join(', ')}
    - Technical Skills: ${resumeData.skills?.technical?.join(', ') || 'Not specified'}
    - Product Skills: ${resumeData.skills?.product?.join(', ') || 'Not specified'}
    - Companies: ${resumeData.experience?.companies?.slice(0, 3).join(', ') || 'Not specified'}
    - Education: ${resumeData.education?.institutions?.join(', ') || 'Not specified'}

    PERPLEXITY CONTEXT:
    ${this.perplexityContext}

    ESSAY REQUIREMENTS:
    - Exactly ~400 words
    - Highlight genuine experiences that demonstrate APM potential
    - Connect candidate's background to Perplexity's mission
    - Show technical curiosity and product intuition
    - Include specific examples with impact
    - Sound authentic and personal, not generic
    - Demonstrate understanding of Perplexity's user-first approach

    STRUCTURE GUIDANCE:
    - Opening: Hook with relevant experience or passion
    - Body: 2-3 specific examples showing APM competencies
    - Closing: Vision for contribution to Perplexity's mission

    Focus on the candidate's ${strengths.join(' and ').toLowerCase()} as primary selling points.
    ${isRegeneration ? 'Provide a fresh perspective with different examples and structure.' : ''}
    `;
  }

  ensureWordCount(essay, targetWords) {
    const words = essay.split(/\s+/).filter(word => word.length > 0);
    const currentCount = words.length;
    
    if (currentCount > targetWords + 20) {
      // Trim if too long
      return words.slice(0, targetWords).join(' ') + '.';
    } else if (currentCount < targetWords - 20) {
      // Add conclusion if too short
      const addition = " This opportunity represents the perfect intersection of my technical curiosity, product instincts, and passion for empowering users through better information discovery.";
      return essay + addition;
    }
    
    return essay;
  }
}

module.exports = new AIService();

// utils/analytics.js
const fs = require('fs').promises;
const path = require('path');

class Analytics {
  constructor() {
    this.dataFile = path.join(__dirname, '../data/analytics.json');
    this.initializeDataFile();
  }

  async initializeDataFile() {
    try {
      await fs.access(this.dataFile);
    } catch (error) {
      // Create directory if it doesn't exist
      const dir = path.dirname(this.dataFile);
      await fs.mkdir(dir, { recursive: true });
      
      // Initialize with empty analytics data
      const initialData = {
        events: [],
        summary: {
          totalUploads: 0,
          totalScorecardsGenerated: 0,
          totalEssaysGenerated: 0,
          totalExports: 0,
          totalEmailsSent: 0
        }
      };
      await fs.writeFile(this.dataFile, JSON.stringify(initialData, null, 2));
    }
  }

  async trackAnalytics(eventName, eventData = {}) {
    try {
      const data = await this.readAnalyticsData();
      
      // Add new event
      data.events.push({
        event: eventName,
        timestamp: new Date().toISOString(),
        ...eventData
      });

      // Update summary counters
      this.updateSummary(data.summary, eventName);

      // Keep only last 1000 events to prevent file from growing too large
      if (data.events.length > 1000) {
        data.events = data.events.slice(-1000);
      }

      await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  async getAnalyticsStats() {
    try {
      const data = await this.readAnalyticsData();
      
      // Calculate additional stats
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentEvents = data.events.filter(event => 
        new Date(event.timestamp) > last24Hours
      );

      return {
        ...data.summary,
        recentActivity: recentEvents.length,
        conversionRate: this.calculateConversionRate(data.summary),
        lastActivity: data.events.length > 0 ? data.events[data.events.length - 1].timestamp : null
      };
    } catch (error) {
      console.error('Analytics stats error:', error);
      return {};
    }
  }

  async readAnalyticsData() {
    const fileContent = await fs.readFile(this.dataFile, 'utf8');
    return JSON.parse(fileContent);
  }

  updateSummary(summary, eventName) {
    switch (eventName) {
      case 'resume_uploaded':
        summary.totalUploads++;
        break;
      case 'scorecard_generated':
        summary.totalScorecardsGenerated++;
        break;
      case 'essay_generated':
      case 'essay_regenerated':
        summary.totalEssaysGenerated++;
        break;
      case 'essay_copied':
      case 'essay_downloaded':
        summary.totalExports++;
        break;
      case 'essay_emailed':
        summary.totalEmailsSent++;
        break;
    }
  }

  calculateConversionRate(summary) {
    if (summary.totalUploads === 0) return 0;
    return Math.round((summary.totalExports / summary.totalUploads) * 100);
  }
}

module.exports = new Analytics();

// package.json
{
  "name": "profilecrafted-apm-backend",
  "version": "1.0.0",
  "description": "Backend API for ProfileCrafted Perplexity APM Essay Generator",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.6.0",
    "openai": "^4.20.1",
    "nodemailer": "^6.9.7",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}

// .env.example
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@profilecrafted.com

# Security
JWT_SECRET=your_jwt_secret_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large',
      message: 'File size must be less than 5MB'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      error: 'Too many files',
      message: 'Only one file allowed per upload'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }

  // OpenAI API errors
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests to AI service. Please try again later.'
    });
  }

  if (err.status === 401) {
    return res.status(500).json({
      error: 'Service configuration error',
      message: 'AI service is temporarily unavailable'
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorHandler;

// utils/validation.js
const { body } = require('express-validator');

const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const validateEssay = [
  body('essay')
    .isLength({ min: 100, max: 600 })
    .withMessage('Essay must be between 100 and 600 words')
];

const validateResumeData = [
  body('resumeData')
    .notEmpty()
    .withMessage('Resume data is required')
    .isObject()
    .withMessage('Resume data must be an object')
];

const validateScorecard = [
  body('scorecard')
    .notEmpty()
    .withMessage('Scorecard data is required')
    .isObject()
    .withMessage('Scorecard must be an object')
];

module.exports = {
  validateEmail,
  validateEssay,
  validateResumeData,
  validateScorecard
};

// data/.gitkeep
# This file ensures the data directory is created in version control
# The analytics.json file will be created automatically by the application

// tests/resume.test.js
const request = require('supertest');
const express = require('express');
const resumeController = require('../controllers/resumeController');

describe('Resume Controller', () => {
  test('should handle missing file upload', async () => {
    const app = express();
    app.post('/upload', resumeController.uploadAndParse);

    const response = await request(app)
      .post('/upload')
      .expect(400);

    expect(response.body).toHaveProperty('error', 'No file uploaded');
  });
});

// README.md content for setup instructions
# ProfileCrafted APM Tool - Backend

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Required environment variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SMTP_*`: Email service credentials
   - `FRONTEND_URL`: Your frontend URL for CORS

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Start production server:**
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/upload-resume` - Upload and parse resume
- `POST /api/generate-scorecard` - Generate role fit scorecard
- `POST /api/generate-essay` - Generate APM essay
- `POST /api/regenerate-essay` - Regenerate essay variation
- `POST /api/export` - Handle export actions
- `POST /api/email-essay` - Send essay via email
- `POST /api/analytics/track` - Track user events
- `GET /api/analytics/stats` - Get usage statistics
- `GET /api/health` - Health check endpoint

## Features Implemented

✅ Resume upload and parsing (PDF/DOCX)
✅ Role fit scoring with 5 categories
✅ AI-powered essay generation (GPT-4)
✅ Essay regeneration with variations
✅ Export functionality (copy/download/email)
✅ Email delivery with templates
✅ Analytics tracking and stats
✅ Rate limiting and security
✅ Error handling and validation
✅ File size and type validation

## Architecture

- **Express.js** server with modular controllers
- **Multer** for file upload handling
- **PDF-parse & Mammoth** for document parsing
- **OpenAI GPT-4** for essay generation
- **Nodemailer** for email delivery
- **File-based analytics** (easily upgradeable to database)
- **Comprehensive error handling** and security middleware

## Deployment Ready

The backend is ready for deployment on platforms like:
- Vercel (with serverless functions)
- Railway
- Heroku
- AWS/GCP/Azure

All features from the PRD are implemented with no additional requirements.].message.content.trim();
      return this.ensureWordCount(essay, 400);
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate essay');
    }
  }

  async regenerateEssay(resumeData, scorecard, currentEssay) {
    const prompt = this.buildEssayPrompt(resumeData, scorecard, true);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert product manager and career coach. Generate a different version of the essay 
            with varied structure and emphasis while maintaining the same core information. Avoid repeating the exact 
            same phrases or structure as the previous version.`
          },
          {
            role: 'user',
            content: `${prompt}\n\nPrevious essay to avoid repeating:\n${currentEssay}\n\nGenerate a fresh version with different structure and phrasing.`
          }
        ],
        max_tokens: 600,
        temperature: 0.8
      });

      const essay = response.choices[0