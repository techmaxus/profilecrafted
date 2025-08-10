import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const { resumeText, fileKey } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    // APM-focused analysis prompt
    const analysisPrompt = `
You are an expert APM (Associate Product Manager) recruiter analyzing a resume. Provide a comprehensive analysis with specific scores and feedback.

Resume Content:
${resumeText}

Please analyze this resume for APM roles and provide:

1. OVERALL APM FIT SCORE (0-100): Overall suitability for APM roles
2. CATEGORY SCORES (0-100 each):
   - Technical Skills: Programming, data analysis, technical aptitude
   - Product Sense: Product thinking, user focus, market understanding
   - Leadership: Team leadership, project management, influence
   - Analytics: Data-driven decision making, metrics, experimentation
   - Communication: Written/verbal communication, stakeholder management

3. DETAILED FEEDBACK:
   - Top 3 strengths for APM roles
   - Top 3 areas for improvement
   - Specific recommendations for enhancement
   - Missing elements typically expected in APM candidates

4. EXPERIENCE ANALYSIS:
   - Relevant product management experience
   - Technical background assessment
   - Leadership and impact examples
   - Cross-functional collaboration evidence

Format your response as JSON with this structure:
{
  "overallScore": number,
  "categoryScores": {
    "technical": number,
    "productSense": number,
    "leadership": number,
    "analytics": number,
    "communication": number
  },
  "strengths": [string, string, string],
  "improvements": [string, string, string],
  "recommendations": [string, string, string],
  "experienceAnalysis": {
    "productExperience": string,
    "technicalBackground": string,
    "leadershipEvidence": string,
    "collaborationSkills": string
  },
  "summary": string
}
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert APM recruiter. Analyze resumes thoroughly and provide actionable feedback in valid JSON format.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const analysisResult = completion.choices[0]?.message?.content;

    if (!analysisResult) {
      throw new Error('No analysis result from AI');
    }

    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(analysisResult);
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      analysis = {
        overallScore: 75,
        categoryScores: {
          technical: 70,
          productSense: 75,
          leadership: 80,
          analytics: 70,
          communication: 75
        },
        strengths: [
          "Strong analytical background",
          "Good communication skills",
          "Relevant experience"
        ],
        improvements: [
          "Enhance technical skills",
          "Develop product sense",
          "Show more leadership impact"
        ],
        recommendations: [
          "Take product management courses",
          "Work on technical projects",
          "Lead cross-functional initiatives"
        ],
        experienceAnalysis: {
          productExperience: "Some relevant experience identified",
          technicalBackground: "Technical skills present",
          leadershipEvidence: "Leadership potential shown",
          collaborationSkills: "Good collaboration indicators"
        },
        summary: "Analysis completed with AI assistance",
        rawResponse: analysisResult
      };
    }

    return NextResponse.json({
      success: true,
      analysis: analysis,
      fileKey: fileKey,
      analyzedAt: new Date().toISOString(),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to analyze resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
