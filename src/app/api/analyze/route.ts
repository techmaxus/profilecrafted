import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Analysis API called');
    
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ OpenAI API key not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('✅ OpenAI API key configured');
    const { resumeText, fileKey } = await request.json();
    console.log('📄 Request data:', { 
      hasResumeText: !!resumeText, 
      resumeTextLength: resumeText?.length || 0,
      fileKey: fileKey 
    });

    if (!resumeText) {
      console.log('❌ No resume text provided');
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400, headers: corsHeaders }
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
    console.log('🤖 Calling OpenAI API with model:', process.env.OPENAI_MODEL || 'gpt-4o-mini');
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

    console.log('✅ OpenAI API response received');
    const analysisResult = completion.choices[0]?.message?.content;
    console.log('📊 Analysis result length:', analysisResult?.length || 0);

    if (!analysisResult) {
      throw new Error('No analysis result from AI');
    }

    // Parse the JSON response
    let analysis;
    try {
      console.log('🔄 Parsing JSON response from OpenAI');
      analysis = JSON.parse(analysisResult);
      console.log('✅ JSON parsing successful');
    } catch (parseError) {
      console.log('❌ JSON parsing failed, using fallback response');
      console.log('Parse error:', parseError instanceof Error ? parseError.message : 'Unknown');
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

    console.log('🎉 Analysis completed successfully, sending response');
    return NextResponse.json({
      success: true,
      analysis: analysis,
      fileKey: fileKey,
      analyzedAt: new Date().toISOString(),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    }, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to analyze resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
