// Security middleware for API endpoints
import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface SecurityConfig {
  maxRequests: number;
  windowMs: number;
  maxFileSize: number;
  allowedOrigins: string[];
}

const defaultConfig: SecurityConfig = {
  maxRequests: 10, // requests per window
  windowMs: 60 * 1000, // 1 minute
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedOrigins: [
    'http://localhost:3000',
    'https://profilecrafted.vercel.app',
    // Add your custom domain here
  ]
};

export class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Rate limiting
  public rateLimit(request: NextRequest): { allowed: boolean; error?: string } {
    const ip = this.getClientIP(request);
    const now = Date.now();
    const key = `rate_limit:${ip}`;
    
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      // Reset or initialize
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return { allowed: true };
    }
    
    if (current.count >= this.config.maxRequests) {
      return {
        allowed: false,
        error: `Rate limit exceeded. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds.`
      };
    }
    
    // Increment count
    current.count++;
    rateLimitStore.set(key, current);
    
    return { allowed: true };
  }

  // CORS validation
  public validateCORS(request: NextRequest): { allowed: boolean; headers: Record<string, string> } {
    const origin = request.headers.get('origin');
    const isAllowed = !origin || this.config.allowedOrigins.includes(origin) || 
                     (process.env.NODE_ENV === 'development');

    const headers: Record<string, string> = {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    if (isAllowed && origin) {
      headers['Access-Control-Allow-Origin'] = origin;
    }

    return { allowed: isAllowed, headers };
  }

  // File validation
  public validateFile(file: File, allowedTypes: string[]): { valid: boolean; error?: string } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${Math.round(this.config.maxFileSize / 1024 / 1024)}MB`
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        valid: false,
        error: 'File is empty'
      };
    }

    return { valid: true };
  }

  // Input sanitization
  public sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  // Get client IP
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return 'unknown';
  }

  // Security headers
  public getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    };
  }

  // Environment validation
  public validateEnvironment(): { valid: boolean; missing: string[] } {
    const required = ['OPENAI_API_KEY', 'CLOUDFLARE_R2_ACCOUNT_ID'];
    const missing: string[] = [];

    for (const env of required) {
      if (!process.env[env]) {
        missing.push(env);
      }
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }
}

// Create singleton instance
export const security = new SecurityMiddleware();

// Helper function to apply security to API routes
export function withSecurity(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    rateLimit?: boolean;
    fileUpload?: boolean;
    allowedFileTypes?: string[];
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Environment validation
      const envCheck = security.validateEnvironment();
      if (!envCheck.valid) {
        console.error('❌ Missing environment variables:', envCheck.missing);
        return NextResponse.json(
          { success: false, error: 'Server configuration error' },
          { status: 500 }
        );
      }

      // Rate limiting
      if (options.rateLimit !== false) {
        const rateLimitResult = security.rateLimit(request);
        if (!rateLimitResult.allowed) {
          return NextResponse.json(
            { success: false, error: rateLimitResult.error },
            { status: 429 }
          );
        }
      }

      // CORS validation
      const corsResult = security.validateCORS(request);
      if (!corsResult.allowed) {
        return NextResponse.json(
          { success: false, error: 'Origin not allowed' },
          { status: 403 }
        );
      }

      // Handle OPTIONS request
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 200,
          headers: {
            ...corsResult.headers,
            ...security.getSecurityHeaders()
          }
        });
      }

      // File validation for upload endpoints
      if (options.fileUpload && request.method === 'POST') {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (file && options.allowedFileTypes) {
          const fileValidation = security.validateFile(file, options.allowedFileTypes);
          if (!fileValidation.valid) {
            return NextResponse.json(
              { success: false, error: fileValidation.error },
              { status: 400 }
            );
          }
        }
      }

      // Call the actual handler
      const response = await handler(request);

      // Add security headers to response
      const headers = security.getSecurityHeaders();
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;

    } catch (error) {
      console.error('❌ Security middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
