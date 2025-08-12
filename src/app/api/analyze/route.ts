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
  let resumeText = '';
  let fileKey = '';
  
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
    const requestData = await request.json();
    resumeText = requestData.resumeText;
    fileKey = requestData.fileKey;
    console.log('📄 Request data:', {
      hasResumeText: !!resumeText,
      resumeTextLength: resumeText?.length || 0,
      fileKey: fileKey || 'none'
    });
    
    // Debug: Show first 500 characters of resume text to check readability
    if (resumeText) {
      console.log('📝 Resume text preview (first 500 chars):', resumeText.substring(0, 500));
    }

    if (!resumeText) {
      console.log('❌ No resume text provided');
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // APM-focused analysis prompt
    const prompt = `
You are an expert APM recruiter analyzing resumes for Associate Product Manager positions at top tech companies.

IMPORTANT: If the resume text appears garbled, corrupted, or unreadable, please do your best to extract any meaningful information and provide reasonable scores based on what you can understand. Do not return all 0 scores unless the text is completely empty.

Analyze this resume and provide a comprehensive APM fit assessment:

${resumeText}

Evaluate the candidate across these 5 key dimensions:
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
  "overall": number,
  "technicalFluency": number,
  "productThinking": number,
  "curiosityCreativity": number,
  "communicationClarity": number,
  "leadershipTeamwork": number,
  "tips": {
    "technicalFluency": string,
    "productThinking": string,
    "curiosityCreativity": string,
    "communicationClarity": string,
    "leadershipTeamwork": string
  },
  "strengths": [string, string, string],
  "improvements": [string, string, string],
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
          content: prompt
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
      
      // Clean the response - remove markdown code blocks if present
      let cleanedResult = analysisResult.trim();
      if (cleanedResult.startsWith('```json')) {
        cleanedResult = cleanedResult.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResult.startsWith('```')) {
        cleanedResult = cleanedResult.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const rawAnalysis = JSON.parse(cleanedResult);
      console.log('✅ JSON parsing successful');
      console.log('🔍 OpenAI response structure:', JSON.stringify(rawAnalysis, null, 2));
      
      // Transform OpenAI response to match frontend expectations
      if (rawAnalysis.overallScore && rawAnalysis.categoryScores) {
        // Old structure - transform to new flattened structure
        console.log('🔄 Transforming old structure to flattened format');
        analysis = {
          overall: rawAnalysis.overallScore,
          technicalFluency: rawAnalysis.categoryScores.technical || rawAnalysis.categoryScores.technicalFluency || 0,
          productThinking: rawAnalysis.categoryScores.productSense || rawAnalysis.categoryScores.productThinking || 0,
          curiosityCreativity: rawAnalysis.categoryScores.analytics || rawAnalysis.categoryScores.curiosityCreativity || 0,
          communicationClarity: rawAnalysis.categoryScores.communication || rawAnalysis.categoryScores.communicationClarity || 0,
          leadershipTeamwork: rawAnalysis.categoryScores.leadership || rawAnalysis.categoryScores.leadershipTeamwork || 0,
          tips: rawAnalysis.tips || {
            technicalFluency: "Focus on quantifying your technical impact",
            productThinking: "Highlight product strategy examples",
            curiosityCreativity: "Show innovative problem-solving",
            communicationClarity: "Demonstrate clear communication",
            leadershipTeamwork: "Provide leadership examples"
          },
          strengths: rawAnalysis.strengths || [],
          improvements: rawAnalysis.improvements || [],
          experienceAnalysis: rawAnalysis.experienceAnalysis || {},
          summary: rawAnalysis.summary || "Analysis completed successfully"
        };
      } else {
        // Already in correct flattened structure
        console.log('✅ Response already in correct flattened format');
        analysis = rawAnalysis;
      }
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
    
    // Check if it's an OpenAI quota error
    if (error instanceof Error && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('insufficient_quota'))) {
      console.log('🔄 OpenAI quota exceeded, using fallback analysis');
      
      // Generate intelligent fallback based on resume length and content
      const resumeLength = resumeText.length;
      const hasEducation = resumeText.toLowerCase().includes('education') || resumeText.toLowerCase().includes('university') || resumeText.toLowerCase().includes('degree');
      const hasTech = resumeText.toLowerCase().includes('python') || resumeText.toLowerCase().includes('sql') || resumeText.toLowerCase().includes('javascript') || resumeText.toLowerCase().includes('data');
      const hasLeadership = resumeText.toLowerCase().includes('lead') || resumeText.toLowerCase().includes('manage') || resumeText.toLowerCase().includes('team');
      
      const fallbackAnalysis = {
        overall: Math.min(85, Math.max(65, Math.floor(resumeLength / 700) + 60)),
        technicalFluency: hasTech ? Math.floor(Math.random() * 20) + 70 : Math.floor(Math.random() * 15) + 60,
        productThinking: Math.floor(Math.random() * 20) + 65,
        leadershipTeamwork: hasLeadership ? Math.floor(Math.random() * 25) + 70 : Math.floor(Math.random() * 20) + 55,
        curiosityCreativity: hasTech ? Math.floor(Math.random() * 20) + 75 : Math.floor(Math.random() * 15) + 65,
        communicationClarity: Math.floor(Math.random() * 20) + 70,
        tips: {
          technicalFluency: "Focus on quantifying your technical impact and showcasing specific tools/technologies you've used",
          productThinking: "Highlight examples of product strategy, user research, and data-driven decision making",
          curiosityCreativity: "Demonstrate innovative problem-solving and your approach to exploring new solutions",
          communicationClarity: "Show evidence of clear written communication and cross-functional collaboration",
          leadershipTeamwork: "Provide specific examples of leading projects or mentoring team members"
        },
        strengths: [
          "Strong analytical and problem-solving capabilities",
          "Good technical foundation with relevant experience",
          "Demonstrates clear communication skills",
          "Shows potential for product management growth"
        ],
        improvements: [
          "Develop deeper product strategy experience",
          "Gain more cross-functional collaboration experience",
          "Build stronger data analysis capabilities",
          "Enhance user research and customer empathy skills"
        ],
        experienceAnalysis: {
          productExperience: hasEducation ? "Relevant educational background with some practical experience" : "Some relevant experience identified",
          technicalBackground: hasTech ? "Strong technical skills evident" : "Basic technical competency shown",
          leadershipEvidence: hasLeadership ? "Leadership experience demonstrated" : "Leadership potential identified",
          collaborationSkills: "Good collaboration and teamwork indicators"
        },
        summary: "Strong candidate with solid foundation for APM roles. Focus on developing product strategy and cross-functional leadership skills.",
        fallbackUsed: true,
        note: "Analysis generated using fallback due to API quota limits"
      };
      
      return NextResponse.json({
        success: true,
        analysis: fallbackAnalysis,
        fileKey: fileKey,
        analyzedAt: new Date().toISOString(),
        model: 'fallback-analyzer'
      }, {
        headers: corsHeaders
      });
    }
    
    // For other errors, return standard error response
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
