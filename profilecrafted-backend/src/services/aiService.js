/**
 * Production AI Service Integration
 * Industry-standard AI providers with fallback and error handling
 */

const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const credentialManager = require('./credentialManager');
const { generateEssayPrompt } = require('../essayGenerator');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/ai-service.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class AIService {
  constructor() {
    this.openai = null;
    this.anthropic = null;
    this.initializeProviders();
  }

  /**
   * Initialize AI providers with secure credential management
   */
  initializeProviders() {
    try {
      // OpenAI initialization
      if (process.env.OPENAI_API_KEY) {
        try {
          this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 30000,
            maxRetries: 3
          });
          logger.info('✅ OpenAI service initialized successfully for real AI analysis');
        } catch (error) {
          logger.warn('OpenAI initialization failed, will use mock service:', error.message);
          this.openai = null;
        }
      } else {
        logger.info('No OpenAI API key found, will use mock service');
      }

      // Anthropic initialization
      if (process.env.ANTHROPIC_API_KEY) {
        try {
          this.anthropic = new Anthropic({
            apiKey: credentialManager.getSecureApiKey('ANTHROPIC_API_KEY'),
            timeout: 30000,
            maxRetries: 3
          });
          logger.info('Anthropic service initialized');
        } catch (error) {
          logger.warn('Anthropic initialization failed, will use mock service:', error.message);
          this.anthropic = null;
        }
      } else {
        logger.info('No Anthropic API key found, will use mock service');
      }

      if (!this.openai && !this.anthropic) {
        logger.warn('No AI providers configured - falling back to mock mode');
      }

    } catch (error) {
      logger.error('Failed to initialize AI providers:', error);
      throw new Error('AI service initialization failed');
    }
  }

  /**
   * Analyze resume content using AI
   */
  async analyzeResume(resumeText) {
    try {
      logger.info('🔍 Starting resume analysis...', { 
        hasOpenAI: !!this.openai, 
        hasAnthropic: !!this.anthropic,
        resumeLength: resumeText?.length || 0 
      });

      const prompt = `Analyze this resume for APM (Associate Product Manager) fit. Provide scores (0-100) for:
      - Overall fit
      - Technical fluency
      - Product thinking
      - Curiosity & creativity
      - Communication clarity
      - Leadership & teamwork
      
      Resume content: ${resumeText}
      
      Return JSON format: {"overall": 85, "technicalFluency": 80, "productThinking": 90, ...}`;
      
      // Try OpenAI first, then Anthropic, then fallback
      if (this.openai) {
        logger.info('🤖 Using real OpenAI for resume analysis');
        const result = await this.analyzeWithOpenAI(prompt);
        logger.info('✅ OpenAI resume analysis completed successfully');
        return result;
      } else if (this.anthropic) {
        logger.info('🤖 Using real Anthropic for resume analysis');
        return await this.analyzeWithAnthropic(prompt);
      } else {
        logger.warn('⚠️ No AI service available - using enhanced mock analysis');
        return this.generateEnhancedMockAnalysis(resumeText);
      }

    } catch (error) {
      logger.error('❌ Resume analysis failed, falling back to mock:', error);
      // Always fall back to mock analysis if AI services fail
      return this.generateEnhancedMockAnalysis(resumeText);
    }
  }

  /**
   * Generate essay using AI
   */
  async generateEssay(scores, resumeContent = '') {
    try {
      const prompt = generateEssayPrompt(scores, resumeContent);
      
      // Try OpenAI first, then Anthropic, then fallback
      if (this.openai) {
        return await this.generateEssayWithOpenAI(prompt);
      } else if (this.anthropic) {
        return await this.generateEssayWithAnthropic(prompt);
      } else {
        logger.warn('No AI service available - using sophisticated mock generation');
        const { generateSophisticatedEssay } = require('../essayGenerator');
        return generateSophisticatedEssay(scores, resumeContent);
      }

    } catch (error) {
      logger.error('Essay generation failed, falling back to mock:', error);
      // Always fall back to sophisticated mock generation if AI services fail
      const { generateSophisticatedEssay } = require('../essayGenerator');
      return generateSophisticatedEssay(scores, resumeContent);
    }
  }

  /**
   * OpenAI resume analysis
   */
  async analyzeWithOpenAI(prompt) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert APM hiring manager. Analyze resumes and provide structured scoring.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const content = response.choices[0].message.content;
      logger.info('OpenAI analysis response received:', { contentLength: content.length });
      return this.parseAnalysisResponse(content);
    } catch (error) {
      logger.error('OpenAI analysis failed:', error);
      throw error;
    }
  }

  /**
   * Parse AI analysis response into structured format
   */
  parseAnalysisResponse(content) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Ensure all required fields exist with defaults
        return {
          overall: parsed.overall || 75,
          technicalFluency: parsed.technicalFluency || parsed.technical || 70,
          productThinking: parsed.productThinking || parsed.product || 75,
          curiosityCreativity: parsed.curiosityCreativity || parsed.curiosity || 80,
          communicationClarity: parsed.communicationClarity || parsed.communication || 75,
          leadershipTeamwork: parsed.leadershipTeamwork || parsed.leadership || 70,
          tips: parsed.tips || ['Focus on quantifiable achievements', 'Highlight product impact', 'Demonstrate analytical thinking']
        };
      }
      
      // Fallback if no JSON found
      logger.warn('Could not parse JSON from AI response, using default scores');
      return {
        overall: 75,
        technicalFluency: 70,
        productThinking: 75,
        curiosityCreativity: 80,
        communicationClarity: 75,
        leadershipTeamwork: 70,
        tips: ['Focus on quantifiable achievements', 'Highlight product impact', 'Demonstrate analytical thinking']
      };
    } catch (error) {
      logger.error('Failed to parse analysis response:', error);
      throw error;
    }
  }

  /**
   * Anthropic resume analysis
   */
  async analyzeWithAnthropic(prompt) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return this.parseAnalysisResponse(response.content[0].text);
    } catch (error) {
      logger.error('Anthropic analysis failed:', error);
      throw error;
    }
  }

  /**
   * OpenAI essay generation
   */
  async generateEssayWithOpenAI(prompt) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 600
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      logger.error('OpenAI essay generation failed:', error);
      throw error;
    }
  }

  /**
   * Anthropic essay generation
   */
  async generateEssayWithAnthropic(prompt) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 600,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return response.content[0].text.trim();
    } catch (error) {
      logger.error('Anthropic essay generation failed:', error);
      throw error;
    }
  }

  /**
   * Build resume analysis prompt
   */
  buildResumeAnalysisPrompt(resumeText) {
    return `Analyze this resume for an Associate Product Manager position at Perplexity. 
    
Provide scores (0-100) for these categories:
1. Technical Fluency - coding skills, technical tools, system understanding
2. Product Thinking - product sense, user focus, market understanding
3. Curiosity & Creativity - innovation, learning, creative problem solving
4. Communication Clarity - writing, presentation, stakeholder management
5. Leadership & Teamwork - collaboration, influence, project leadership

Return response in this exact JSON format:
{
  "overall": [score],
  "technicalFluency": [score],
  "productThinking": [score], 
  "curiosityCreativity": [score],
  "communicationClarity": [score],
  "leadershipTeamwork": [score],
  "tips": {
    "technicalFluency": "specific improvement tip",
    "productThinking": "specific improvement tip",
    "curiosityCreativity": "specific improvement tip", 
    "communicationClarity": "specific improvement tip",
    "leadershipTeamwork": "specific improvement tip"
  }
}

Resume Content:
${resumeText}`;
  }

  /**
   * Parse AI analysis response
   */
  parseAnalysisResponse(response) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing if no JSON found
      throw new Error('Invalid response format');
    } catch (error) {
      logger.error('Failed to parse AI response:', error);
      return this.generateEnhancedMockAnalysis();
    }
  }

  /**
   * Enhanced mock analysis based on resume content
   */
  generateEnhancedMockAnalysis(resumeText = '') {
    // Analyze resume text for keywords and generate more realistic scores
    const techKeywords = ['python', 'javascript', 'sql', 'api', 'database', 'coding', 'programming', 'software', 'technical', 'engineering'];
    const productKeywords = ['product', 'user', 'customer', 'market', 'strategy', 'analytics', 'metrics', 'growth', 'feature'];
    const leadershipKeywords = ['lead', 'manage', 'team', 'project', 'coordinate', 'collaborate', 'mentor', 'organize'];
    const communicationKeywords = ['present', 'write', 'communicate', 'stakeholder', 'report', 'documentation'];
    const creativityKeywords = ['innovation', 'creative', 'design', 'solution', 'problem-solving', 'research'];

    const text = resumeText.toLowerCase();
    
    const techScore = Math.min(100, 60 + this.countKeywords(text, techKeywords) * 5);
    const productScore = Math.min(100, 65 + this.countKeywords(text, productKeywords) * 4);
    const leadershipScore = Math.min(100, 70 + this.countKeywords(text, leadershipKeywords) * 4);
    const communicationScore = Math.min(100, 75 + this.countKeywords(text, communicationKeywords) * 3);
    const creativityScore = Math.min(100, 65 + this.countKeywords(text, creativityKeywords) * 4);

    const overall = Math.round((techScore + productScore + leadershipScore + communicationScore + creativityScore) / 5);

    return {
      overall,
      technicalFluency: techScore,
      productThinking: productScore,
      curiosityCreativity: creativityScore,
      communicationClarity: communicationScore,
      leadershipTeamwork: leadershipScore,
      tips: {
        technicalFluency: techScore < 80 ? "Consider highlighting specific programming languages and technical projects" : "Strong technical foundation evident",
        productThinking: productScore < 80 ? "Emphasize user-focused projects and product metrics" : "Excellent product sense demonstrated",
        curiosityCreativity: creativityScore < 80 ? "Showcase innovative projects and creative problem-solving" : "Creative approach clearly demonstrated",
        communicationClarity: communicationScore < 80 ? "Highlight presentation skills and stakeholder communication" : "Communication skills well-documented",
        leadershipTeamwork: leadershipScore < 80 ? "Emphasize team leadership and collaborative achievements" : "Strong leadership experience shown"
      }
    };
  }

  /**
   * Count keyword occurrences in text
   */
  countKeywords(text, keywords) {
    return keywords.reduce((count, keyword) => {
      return count + (text.includes(keyword) ? 1 : 0);
    }, 0);
  }

  /**
   * Check if production AI services are available
   */
  isProductionMode() {
    return !!(this.openai || this.anthropic);
  }

  /**
   * Get available AI providers
   */
  getAvailableProviders() {
    const providers = [];
    if (this.openai) providers.push('OpenAI');
    if (this.anthropic) providers.push('Anthropic');
    return providers;
  }
}

module.exports = new AIService();
