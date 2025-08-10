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

    const { analysis, resumeText, prompt, targetLength } = await request.json();

    if (!analysis || !resumeText) {
      return NextResponse.json(
        { error: 'Analysis and resume text are required' },
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
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate essay',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
