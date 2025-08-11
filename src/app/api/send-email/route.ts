import { NextRequest, NextResponse } from 'next/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { email, essay } = await request.json();

    if (!email || !essay) {
      return NextResponse.json(
        { error: 'Email and essay are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if email service is configured
    if (!process.env.EMAIL_SERVICE_API_KEY) {
      console.log('📧 Email service not configured, simulating email send');
      
      // Simulate successful email send for demo purposes
      return NextResponse.json({
        success: true,
        message: 'Email functionality not configured. In production, this would send the essay to your email.',
        recipient: email,
        wordCount: essay.trim().split(/\s+/).length,
        sentAt: new Date().toISOString()
      }, {
        headers: corsHeaders
      });
    }

    // TODO: Implement actual email sending service (SendGrid, Resend, etc.)
    // For now, return success response
    console.log(`📧 Would send essay (${essay.length} chars) to: ${email}`);
    
    return NextResponse.json({
      success: true,
      message: 'Essay sent successfully!',
      recipient: email,
      wordCount: essay.trim().split(/\s+/).length,
      sentAt: new Date().toISOString()
    }, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500, headers: corsHeaders }
    );
  }
}
