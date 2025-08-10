/**
 * Production Document Parsing Service
 * Industry-standard PDF/DOCX parsing with security
 */

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');
const winston = require('winston');
const { body, validationResult } = require('express-validator');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/document-parser.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class DocumentParser {
  constructor() {
    this.supportedTypes = ['.pdf', '.docx'];
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
  }

  /**
   * Parse uploaded resume file
   */
  async parseResume(filePath, originalName) {
    try {
      // Validate file
      await this.validateFile(filePath, originalName);
      
      const fileExtension = path.extname(originalName).toLowerCase();
      let extractedText = '';

      switch (fileExtension) {
        case '.pdf':
          extractedText = await this.parsePDF(filePath);
          break;
        case '.docx':
          extractedText = await this.parseDOCX(filePath);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      // Clean and validate extracted text
      const cleanedText = this.cleanExtractedText(extractedText);
      
      if (cleanedText.length < 50) {
        throw new Error('Resume appears to be empty or unreadable');
      }

      logger.info(`Successfully parsed ${fileExtension} file: ${originalName}`, {
        textLength: cleanedText.length,
        wordCount: cleanedText.split(/\s+/).length
      });

      return {
        success: true,
        text: cleanedText,
        metadata: {
          originalName,
          fileType: fileExtension,
          textLength: cleanedText.length,
          wordCount: cleanedText.split(/\s+/).length,
          parsedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.error('Document parsing failed:', error);
      throw new Error('Failed to parse resume: ' + error.message);
    } finally {
      // Clean up uploaded file for security
      try {
        await fs.unlink(filePath);
        logger.info(`Cleaned up temporary file: ${filePath}`);
      } catch (cleanupError) {
        logger.warn('Failed to clean up temporary file:', cleanupError);
      }
    }
  }

  /**
   * Parse PDF using pdf-parse
   */
  async parsePDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer, {
        max: 50, // Max pages to parse
        version: 'v1.10.100'
      });

      if (!pdfData.text || pdfData.text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains only images');
      }

      return pdfData.text;
    } catch (error) {
      logger.error('PDF parsing failed:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Parse DOCX using mammoth
   */
  async parseDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      
      if (result.messages && result.messages.length > 0) {
        logger.warn('DOCX parsing warnings:', result.messages);
      }

      if (!result.value || result.value.trim().length === 0) {
        throw new Error('DOCX appears to be empty');
      }

      return result.value;
    } catch (error) {
      logger.error('DOCX parsing failed:', error);
      throw new Error('Failed to extract text from DOCX');
    }
  }

  /**
   * Validate uploaded file
   */
  async validateFile(filePath, originalName) {
    try {
      // Check file exists
      const stats = await fs.stat(filePath);
      
      // Check file size
      if (stats.size > this.maxFileSize) {
        throw new Error(`File too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`);
      }

      if (stats.size === 0) {
        throw new Error('File is empty');
      }

      // Check file extension
      const fileExtension = path.extname(originalName).toLowerCase();
      if (!this.supportedTypes.includes(fileExtension)) {
        throw new Error(`Unsupported file type. Supported types: ${this.supportedTypes.join(', ')}`);
      }

      // Basic security check - ensure it's actually a file
      if (!stats.isFile()) {
        throw new Error('Invalid file upload');
      }

      return true;
    } catch (error) {
      logger.error('File validation failed:', error);
      throw error;
    }
  }

  /**
   * Clean and normalize extracted text
   */
  cleanExtractedText(text) {
    if (!text) return '';

    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove special characters that might cause issues
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Normalize line breaks
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove multiple consecutive newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim();
  }

  /**
   * Extract key sections from resume text
   */
  extractResumeSections(text) {
    const sections = {
      contact: '',
      summary: '',
      experience: '',
      education: '',
      skills: '',
      projects: ''
    };

    try {
      const lines = text.split('\n');
      let currentSection = 'summary';
      
      for (const line of lines) {
        const lowerLine = line.toLowerCase().trim();
        
        // Detect section headers
        if (lowerLine.includes('experience') || lowerLine.includes('work history')) {
          currentSection = 'experience';
        } else if (lowerLine.includes('education') || lowerLine.includes('academic')) {
          currentSection = 'education';
        } else if (lowerLine.includes('skills') || lowerLine.includes('technical')) {
          currentSection = 'skills';
        } else if (lowerLine.includes('projects') || lowerLine.includes('portfolio')) {
          currentSection = 'projects';
        } else if (lowerLine.includes('@') || lowerLine.includes('phone') || lowerLine.includes('linkedin')) {
          currentSection = 'contact';
        }
        
        // Add content to current section
        if (line.trim().length > 0) {
          sections[currentSection] += line + '\n';
        }
      }

      // Clean up sections
      Object.keys(sections).forEach(key => {
        sections[key] = sections[key].trim();
      });

      return sections;
    } catch (error) {
      logger.error('Section extraction failed:', error);
      return { fullText: text };
    }
  }

  /**
   * Get parsing statistics
   */
  getParsingStats(text) {
    if (!text) return null;

    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return {
      characterCount: text.length,
      wordCount: words.length,
      sentenceCount: sentences.length,
      averageWordsPerSentence: Math.round(words.length / sentences.length) || 0,
      estimatedReadingTime: Math.ceil(words.length / 200) // 200 WPM average
    };
  }

  /**
   * Check if service is in production mode
   */
  isProductionMode() {
    return true; // Document parsing is always production-ready
  }

  /**
   * Get supported file types
   */
  getSupportedTypes() {
    return this.supportedTypes;
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      initialized: true,
      supportedTypes: this.supportedTypes,
      maxFileSize: this.maxFileSize,
      mode: 'production'
    };
  }
}

module.exports = new DocumentParser();
