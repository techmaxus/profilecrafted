import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables and service readiness
    const requiredEnvVars = [
      'CLOUDFLARE_R2_ACCOUNT_ID',
      'CLOUDFLARE_R2_ACCESS_KEY_ID',
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
      'CLOUDFLARE_R2_BUCKET_NAME',
      'JWT_SECRET',
      'ENCRYPTION_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    const isReady = missingVars.length === 0;

    return NextResponse.json({
      ready: isReady,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        r2Storage: process.env.CLOUDFLARE_R2_ACCOUNT_ID ? 'configured' : 'missing',
        openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing',
        security: (process.env.JWT_SECRET && process.env.ENCRYPTION_KEY) ? 'configured' : 'missing'
      },
      missingEnvironmentVariables: missingVars,
      config: {
        maxFileSize: process.env.MAX_FILE_SIZE || '5242880',
        allowedFileTypes: process.env.ALLOWED_FILE_TYPES || 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        ready: false,
        error: 'Status check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
