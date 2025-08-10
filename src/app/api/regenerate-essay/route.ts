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

    const { analysis, resumeText, previousEssay, feedback, targetLength } = await request.json();

    if (!analysis || !resumeText) {
      return NextResponse.json(
        { error: 'Analysis and resume text are required' },
        { status: 400 }
      );
    }

    // Essay regeneration prompt
    const regenerationPrompt = `
You are an expert essay writer helping candidates improve their APM application essays.

Based on this resume analysis:
${JSON.stringify(analysis, null, 2)}

Resume content:
${resumeText}

Previous essay:
${previousEssay || 'None provided'}

${feedback ? `User feedback for improvement: ${feedback}` : 'Please create a fresh, improved version.'}

Generate a NEW, IMPROVED ${targetLength || 400}-word essay that:

1. ADDRESSES FEEDBACK: Incorporate any specific user feedback or requests
2. TAKES A DIFFERENT APPROACH: Use a different angle or story than the previous essay
3. MAINTAINS QUALITY: Keep the high standard expected for APM applications
4. SHOWS GROWTH: Demonstrate learning and improvement from the previous version
5. STAYS AUTHENTIC: Ensure the voice remains genuine and personal

The essay should be:
- Exactly ${targetLength || 400} words (±10 words)
- Distinctly different from the previous version
- Professional yet engaging tone
- Specific and impactful
- Tailored for APM roles

Format as a single, well-structured essay without headers or bullet points.
`;

    // Call OpenAI API with higher temperature for more variation
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert essay writer specializing in APM application essays. Create improved, varied versions that address user feedback while maintaining high quality.'
        },
        {
          role: 'user',
          content: regenerationPrompt
        }
      ],
      temperature: 0.8, // Higher temperature for more variation
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
      regeneratedAt: new Date().toISOString(),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      version: 'regenerated'
    });

  } catch (error) {
    console.error('Essay regeneration error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to regenerate essay',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
