import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
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

// Types
interface APMScore {
  overall: number;
  technicalFluency: number;
  productThinking: number;
  curiosityCreativity: number;
  communicationClarity: number;
  leadershipTeamwork: number;
}

interface ScoreWithTips extends APMScore {
  tips: {
    technicalFluency: string;
    productThinking: string;
    curiosityCreativity: string;
    communicationClarity: string;
    leadershipTeamwork: string;
  };
}

// Mock resume analysis function
function analyzeResume(filePath: string): Promise<ScoreWithTips> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Mock scoring logic - in real implementation, this would use AI/ML
      const scores = {
        overall: Math.floor(Math.random() * 30) + 70, // 70-100
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
    }, 2000); // 2 second delay to simulate processing
  });
}

// Mock essay generation function
function generateEssay(scores: APMScore, resumeContent: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock essay generation - in real implementation, this would use AI
      const essay = `As an aspiring Associate Product Manager at Perplexity, I am excited to bring my unique blend of technical expertise and product intuition to help shape the future of AI-powered search and discovery.

My technical background, reflected in my ${scores.technicalFluency}/100 technical fluency score, has equipped me with the foundational skills necessary to collaborate effectively with engineering teams. Through various projects, I have developed proficiency in modern web technologies and data analysis tools, enabling me to bridge the gap between technical possibilities and user needs.

What sets me apart is my product thinking capability, scoring ${scores.productThinking}/100. I have consistently demonstrated the ability to identify user pain points and translate them into actionable product requirements. My approach involves deep user research, competitive analysis, and data-driven decision making to create products that truly resonate with users.

My curiosity and creativity, rated at ${scores.curiosityCreativity}/100, drive me to explore innovative solutions and stay ahead of industry trends. I am particularly passionate about the intersection of AI and user experience, constantly seeking ways to make complex technologies more accessible and intuitive for everyday users.

Communication has always been one of my strongest assets, with a clarity score of ${scores.communicationClarity}/100. I excel at distilling complex technical concepts into clear, actionable insights for diverse stakeholders, from engineers to executives to end users.

Finally, my leadership and teamwork abilities, scoring ${scores.leadershipTeamwork}/100, have been honed through collaborative projects where I have successfully coordinated cross-functional teams to deliver impactful results.

I am eager to contribute to Perplexity's mission of organizing the world's information and making it universally accessible through innovative AI-powered solutions.`;

      resolve(essay);
    }, 3000); // 3 second delay to simulate AI processing
  });
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Upload and analyze resume
app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    
    // Analyze the resume
    const analysis = await analyzeResume(filePath);
    
    // Clean up uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });

    res.json({
      success: true,
      analysis,
      sessionId: Date.now().toString() // Simple session management
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Generate essay
app.post('/api/generate-essay', async (req, res) => {
  try {
    const { scores, sessionId } = req.body;
    
    if (!scores || !sessionId) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const essay = await generateEssay(scores, ''); // Resume content would be stored with sessionId in real app
    
    res.json({
      success: true,
      essay,
      wordCount: essay.split(' ').length
    });

  } catch (error) {
    console.error('Error generating essay:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Regenerate essay
app.post('/api/regenerate-essay', async (req, res) => {
  try {
    const { scores, sessionId } = req.body;
    
    if (!scores || !sessionId) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const essay = await generateEssay(scores, '');
    
    res.json({
      success: true,
      essay,
      wordCount: essay.split(' ').length
    });

  } catch (error) {
    console.error('Error regenerating essay:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Send essay via email
app.post('/api/send-email', async (req, res) => {
  try {
    const { email, essay } = req.body;
    
    if (!email || !essay) {
      return res.status(400).json({ error: 'Missing email or essay content' });
    }

    // Mock email sending - in real implementation, use a service like SendGrid
    console.log(`Sending essay to ${email}`);
    
    res.json({
      success: true,
      message: 'Essay sent successfully!'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 ProfileCrafted backend running on port ${PORT}`);
  console.log('📋 Server started successfully');
  console.log('📁 Upload directory: ./uploads');
  console.log('🌐 CORS enabled for:', process.env.FRONTEND_URL || 'http://localhost:3000');
});

export default app;
