# ProfileCrafted APM Tool - Backend Structure & Guidelines

## 📁 Project Structure
```
backend/
├── server.js                 # Main Express server
├── routes/
│   ├── resume.js             # Resume upload & parsing routes
│   ├── scoring.js            # Role fit analyzer routes
│   ├── essay.js              # Essay generation routes
│   ├── export.js             # Export functionality routes
│   └── analytics.js          # Analytics tracking routes
├── controllers/
│   ├── resumeController.js   # Handle resume processing
│   ├── scoringController.js  # Calculate fit scores
│   ├── essayController.js    # AI essay generation
│   ├── exportController.js   # Export logic
│   └── analyticsController.js # Usage tracking
├── services/
│   ├── resumeParser.js       # PDF/DOCX text extraction
│   ├── scoringEngine.js      # APM criteria matching
│   ├── aiService.js          # OpenAI integration
│   └── emailService.js       # Email delivery
├── middleware/
│   ├── fileUpload.js         # Multer configuration
│   ├── validation.js         # Input validation
│   └── errorHandler.js       # Error management
├── utils/
│   ├── analytics.js          # Event tracking utilities
│   └── helpers.js            # Common functions
├── config/
│   └── database.js           # Optional DB config
└── data/                     # File-based storage
    └── analytics.json        # Usage metrics
```

## 🛠️ Tech Stack Recommendations

### Core Framework
- **Express.js** - REST API server
- **Node.js 18+** - Runtime environment

### File Processing
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

### AI Integration
- **OpenAI API** - GPT-4 for essay generation
- **Custom prompting** - Tailored for Perplexity APM context

### Security & Validation
- **helmet** - Security headers
- **cors** - Cross-origin requests
- **express-rate-limit** - API rate limiting
- **express-validator** - Input validation

### Email & Notifications
- **nodemailer** - Email delivery
- **Email templates** - Professional formatting

### Optional Enhancements
- **PostHog/Analytics** - Advanced tracking
- **Redis** - Caching and rate limiting
- **MongoDB/PostgreSQL** - Database storage

## 🔌 API Endpoints Structure

### Resume Processing
```
POST /api/resume/upload
- Accepts: multipart/form-data (PDF/DOCX)
- Validates: file type, size (<5MB)
- Returns: parsed resume data
```

### Role Fit Analysis
```
POST /api/scoring/analyze
- Accepts: parsed resume data
- Process: match against APM criteria
- Returns: scorecard with 5 categories
```

### Essay Generation
```
POST /api/essay/generate
- Accepts: resume data + scorecard
- Process: AI prompt with context
- Returns: 400-word tailored essay

POST /api/essay/regenerate
- Accepts: same data + current essay
- Process: variation generation
- Returns: new essay version
```

### Export & Lead Capture
```
POST /api/export/copy
POST /api/export/download
POST /api/export/email
- Handles different export methods
- Optional email collection
- Tracks conversion events
```

### Analytics
```
POST /api/analytics/track
GET /api/analytics/stats
- Event tracking for user actions
- Usage statistics dashboard
```

## 📊 Data Flow Architecture

### 1. Resume Upload Flow
```
Frontend Upload → Multer Validation → Text Extraction → Structured Parsing → Response
```

### 2. Scoring Flow
```
Resume Data → Keyword Analysis → Category Scoring → Weight Application → Scorecard
```

### 3. Essay Generation Flow
```
Resume + Scorecard → AI Prompt Building → OpenAI API → Word Count Validation → Essay
```

### 4. Export Flow
```
User Action → Analytics Tracking → Export Processing → Response/Email Delivery
```

## 🎯 Core Service Implementations

### Resume Parser Service
```javascript
class ResumeParser {
  async parseResume(fileBuffer, mimeType)
  extractStructuredData(text)
  // Extract: contact, experience, education, skills, achievements
}
```

### Scoring Engine Service
```javascript
class ScoringEngine {
  calculateFitScore(resumeData)
  // Categories: Technical, Product, Curiosity, Communication, Leadership
  // Weights: 25%, 25%, 20%, 15%, 15%
}
```

### AI Service
```javascript
class AIService {
  generateEssay(resumeData, scorecard)
  regenerateEssay(existing, data)
  // Custom prompts for Perplexity APM context
}
```

## 📈 Analytics Implementation

### Events to Track
- `resume_uploaded` - File processing started
- `scorecard_generated` - Fit analysis completed  
- `essay_generated` - AI essay created
- `essay_regenerated` - Essay variation created
- `essay_copied` - Copy to clipboard
- `essay_downloaded` - File download
- `essay_emailed` - Email delivery

### Metrics Dashboard
- Total uploads, conversions, email captures
- Drop-off analysis by step
- Average scores and completion rates

## 🔒 Security Guidelines

### File Upload Security
- Size limits: 5MB maximum
- Type validation: PDF/DOCX only
- Virus scanning (if required)
- Temporary file cleanup

### API Security
- Rate limiting: 50 requests/15min per IP
- Input validation on all endpoints
- CORS configuration for frontend domain
- Error message sanitization

### Data Privacy
- No permanent file storage
- Resume data purged after processing
- Optional email collection only
- GDPR compliance considerations

## 🚀 Deployment Configuration

### Environment Variables
```bash
PORT=3001
NODE_ENV=production
OPENAI_API_KEY=sk-...
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@profilecrafted.com
FRONTEND_URL=https://profilecrafted.com
```

### Platform Recommendations
1. **Vercel** - Serverless functions, easy Next.js integration
2. **Railway** - Full Node.js hosting with database options
3. **Render** - Simple deployment with automatic SSL

### Performance Optimizations
- Response compression (gzip)
- File processing timeouts (30s max)
- Memory management for large files
- Async processing where possible

## 📝 Implementation Priorities

### Day 1 - Core Infrastructure
- Express server setup with routes
- File upload and parsing functionality
- Basic scoring algorithm implementation

### Day 2 - AI Integration & Logic
- OpenAI integration for essay generation
- Scoring engine with APM criteria
- Email service setup

### Day 3 - Polish & Deploy
- Analytics tracking implementation
- Error handling and validation
- Security middleware and deployment

## 🧪 Testing Strategy

### Unit Tests
- Resume parsing accuracy
- Scoring algorithm validation
- AI prompt effectiveness

### Integration Tests
- File upload pipeline
- End-to-end user flow
- Email delivery confirmation

### Load Testing
- File processing performance
- API response times under load
- OpenAI API rate limit handling

## 💡 Key Implementation Tips

1. **Keep it Simple**: Start with file-based analytics, upgrade to DB later
2. **Error Handling**: Graceful degradation for AI service failures
3. **Caching**: Cache parsed resume data during user session
4. **Monitoring**: Log all OpenAI API calls and costs
5. **Scalability**: Design for easy database integration later

This structure ensures all PRD requirements are covered while providing clear implementation guidance for your 3-day build timeline.