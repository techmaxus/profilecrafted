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
  let analysis: Record<string, unknown> | null = null;
  let targetLength = 400;
  
  try {
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500, headers: corsHeaders }
      );
    }

    const requestData = await request.json();
    analysis = requestData.scores || requestData.analysis;
    const resumeText = requestData.resumeText || "Resume analysis completed";
    const prompt = requestData.prompt || requestData.feedback;
    targetLength = requestData.targetLength || 400;

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis scores are required' },
        { status: 400 }
      );
    }

    // Essay generation prompt
    const essayPrompt = `
You are an expert essay writer helping candidates craft compelling APM application essays. 

Based on this resume analysis:
${JSON.stringify(analysis, null, 2)}

And this resume content:
${resumeText}

${prompt ? `User's specific request: ${prompt}` : ''}

Write a compelling ${targetLength || 400}-word essay that:

1. SHOWCASES APM POTENTIAL: Highlight the candidate's product thinking, technical skills, and leadership abilities
2. TELLS A STORY: Create a narrative that connects their experiences to APM success
3. ADDRESSES GAPS: Subtly address any weaknesses identified in the analysis
4. DEMONSTRATES IMPACT: Focus on quantifiable achievements and outcomes
5. SHOWS PASSION: Convey genuine interest in product management

The essay should be:
- Exactly ${targetLength || 400} words (±10 words)
- Professional yet personable tone
- Structured with clear flow
- Specific and concrete (avoid generic statements)
- Tailored for APM roles at top tech companies

Format as a single, well-structured essay without headers or bullet points.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert essay writer specializing in APM application essays. Write compelling, specific, and impactful essays that showcase candidates\' potential.'
        },
        {
          role: 'user',
          content: essayPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const essayContent = completion.choices[0]?.message?.content;

    if (!essayContent) {
      throw new Error('No essay generated from AI');
    }

    // Count words
    const wordCount = essayContent.trim().split(/\s+/).length;

    return NextResponse.json({
      success: true,
      essay: essayContent,
      wordCount: wordCount,
      targetLength: targetLength || 400,
      generatedAt: new Date().toISOString(),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    });

  } catch (error) {
    console.error('Essay generation error:', error);
    
    // Check if it's an OpenAI quota error (multiple ways to detect)
    const errorObj = error as { status?: number; code?: string };
    const isQuotaError = (
      errorObj?.status === 429 ||
      errorObj?.code === 'insufficient_quota' ||
      (error instanceof Error && (
        error.message.includes('429') || 
        error.message.includes('quota') || 
        error.message.includes('insufficient_quota')
      ))
    );
    
    if (isQuotaError) {
      console.log('🔄 OpenAI quota exceeded, using fallback essay');
      
      // Generate intelligent fallback essay based on analysis scores
      const overallScore = (analysis?.overall as number) || 75;
      const scores = {
        technicalFluency: (analysis?.technicalFluency as number) || 70,
        curiosityCreativity: (analysis?.curiosityCreativity as number) || 70,
        productThinking: (analysis?.productThinking as number) || 70,
        leadershipTeamwork: (analysis?.leadershipTeamwork as number) || 65,
        communicationClarity: (analysis?.communicationClarity as number) || 75
      };
      
      const fallbackEssay = `As an aspiring Associate Product Manager, I am excited to contribute to innovative product development and drive meaningful user experiences. My background demonstrates a strong foundation in analytical thinking and problem-solving, which are essential for success in product management roles.

Throughout my career, I have developed valuable skills in data analysis and technical understanding, scoring ${scores.technicalFluency}/100 in technical fluency. This technical foundation enables me to work effectively with engineering teams and understand the feasibility of product features. My curiosity and creativity, rated at ${scores.curiosityCreativity}/100, allow me to approach problems with innovative solutions and explore new possibilities.

In terms of product thinking, I have cultivated an understanding of user needs and market dynamics, reflected in my ${scores.productThinking}/100 score in this area. I believe that great products start with deep empathy for users and a clear understanding of the problems we're solving. My approach to product development focuses on identifying user pain points and creating solutions that deliver genuine value.

Leadership and communication are areas where I continue to grow, with current scores of ${scores.leadershipTeamwork}/100 and ${scores.communicationClarity}/100 respectively. I am committed to developing these skills further through cross-functional collaboration and by taking on increasing responsibilities in product initiatives.

Looking ahead, I am eager to apply my analytical mindset, technical understanding, and growing product intuition to help build products that users love. I am particularly excited about the opportunity to work in a fast-paced environment where I can learn from experienced product leaders while contributing fresh perspectives and innovative ideas.

My overall APM readiness score of ${overallScore}/100 reflects my current capabilities and my potential for growth in this dynamic field. I am committed to continuous learning and development as I pursue my career in product management.`;

      const wordCount = fallbackEssay.trim().split(/\s+/).length;
      
      return NextResponse.json({
        success: true,
        essay: fallbackEssay,
        wordCount: wordCount,
        targetLength: targetLength || 400,
        generatedAt: new Date().toISOString(),
        model: 'fallback-generator',
        fallbackUsed: true,
        note: "Essay generated using fallback due to API quota limits"
      }, {
        headers: corsHeaders
      });
    }
    
    // For other errors, return standard error response
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate essay',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
