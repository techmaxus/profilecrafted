const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateSophisticatedEssay, generateEssayPrompt } = require('./src/essayGenerator');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

// Mock resume analysis function
function analyzeResume(filePath) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scores = {
        overall: Math.floor(Math.random() * 30) + 70,
        technicalFluency: Math.floor(Math.random() * 30) + 70,
        productThinking: Math.floor(Math.random() * 30) + 70,
        curiosityCreativity: Math.floor(Math.random() * 30) + 70,
        communicationClarity: Math.floor(Math.random() * 30) + 70,
        leadershipTeamwork: Math.floor(Math.random() * 30) + 70,
        tips: {
          technicalFluency: "Highlight specific programming languages and frameworks you've used",
          productThinking: "Include examples of product decisions you've influenced",
          curiosityCreativity: "Showcase side projects or innovative solutions you've built",
          communicationClarity: "Use clear, concise language and quantify your achievements",
          leadershipTeamwork: "Describe collaborative projects and leadership experiences"
        }
      };
      resolve(scores);
    }, 2000);
  });
}

// Sophisticated essay generation function using modular prompt
function generateEssay(scores, resumeContent = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Use the sophisticated essay generator
      const essay = generateSophisticatedEssay(scores, resumeContent);
      resolve(essay);
    }, 3000);
  });
}

// Function to get the full AI prompt (for debugging or AI service integration)
function getAIPrompt(scores, resumeContent = '') {
  return generateEssayPrompt(scores, resumeContent);
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const analysis = await analyzeResume(req.file.path);
    
    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });

    res.json({
      success: true,
      analysis,
      sessionId: Date.now().toString()
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

app.post('/api/generate-essay', async (req, res) => {
  try {
    const { scores, sessionId } = req.body;
    
    if (!scores || !sessionId) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const essay = await generateEssay(scores);
    
    res.json({
      success: true,
      essay,
      wordCount: essay.split(' ').length
    });

  } catch (error) {
    console.error('Error generating essay:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

app.post('/api/regenerate-essay', async (req, res) => {
  try {
    const { scores, sessionId } = req.body;
    
    if (!scores || !sessionId) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const essay = await generateEssay(scores);
    
    res.json({
      success: true,
      essay,
      wordCount: essay.split(' ').length
    });

  } catch (error) {
    console.error('Error regenerating essay:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { email, essay } = req.body;
    
    if (!email || !essay) {
      return res.status(400).json({ error: 'Missing email or essay content' });
    }

    console.log(`📧 Mock: Sending essay to ${email}`);
    
    res.json({
      success: true,
      message: 'Essay sent successfully!'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

// Get AI prompt for debugging or real AI service integration
app.post('/api/get-prompt', async (req, res) => {
  try {
    const { scores, resumeContent } = req.body;
    
    if (!scores) {
      return res.status(400).json({ error: 'Missing scores data' });
    }

    const prompt = getAIPrompt(scores, resumeContent || '');
    
    res.json({
      success: true,
      prompt,
      note: 'Use this prompt with your AI service (OpenAI, Anthropic, etc.)'
    });

  } catch (error) {
    console.error('Error generating prompt:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 ProfileCrafted backend running on port ${PORT}`);
  console.log('📋 Server started successfully');
  console.log('📁 Upload directory: ./uploads');
  console.log('🌐 CORS enabled for: http://localhost:3000');
});

module.exports = app;
