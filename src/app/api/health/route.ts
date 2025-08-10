import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        api: 'operational',
        storage: 'operational',
        ai: process.env.OPENAI_API_KEY ? 'operational' : 'not configured'
      },
      version: '1.0.0'
    });
  } catch {
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    );
  }
}
