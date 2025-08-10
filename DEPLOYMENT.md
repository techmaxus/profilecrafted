# ProfileCrafted Deployment Guide

## Unified Next.js Deployment with Vercel + Cloudflare + R2

This guide walks you through deploying ProfileCrafted as a unified Next.js application using Vercel for hosting, Cloudflare for domain management, and Cloudflare R2 for file storage.

**✨ New Architecture**: All backend API logic has been migrated to Next.js API routes for simplified, unified deployment.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
3. **OpenAI Account**: Sign up at [openai.com](https://openai.com) for AI analysis
4. **Domain**: Your domain should be managed by Cloudflare
5. **GitHub Repository**: Your code should be pushed to GitHub

## Step 1: Cloudflare R2 Setup

### 1.1 Create R2 Bucket
1. Go to Cloudflare Dashboard → R2 Object Storage
2. Click "Create bucket"
3. Name: `profilecrafted-uploads`
4. Location: Choose closest to your users
5. Click "Create bucket"

### 1.2 Generate R2 API Tokens
1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Click "Create Token"
3. Use "Custom token" template
4. Configure:
   - **Token name**: `ProfileCrafted R2 Access`
   - **Permissions**: 
     - Account - Cloudflare R2:Edit
   - **Account Resources**: Include - Your Account
   - **Zone Resources**: All zones
5. Click "Continue to summary" → "Create Token"
6. **Save the token securely** - you'll need it for environment variables

### 1.3 Get Account ID
1. Go to Cloudflare Dashboard → Right sidebar
2. Copy your **Account ID**

## Step 2: Vercel Deployment

### 2.1 Connect GitHub Repository
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your `profilecrafted` repository from GitHub
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `profilecrafted-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

**Note**: The unified architecture means all API routes are now part of the Next.js application.

### 2.2 Environment Variables
Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Cloudflare R2 Storage
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key_here
CLOUDFLARE_R2_BUCKET_NAME=profilecrafted-uploads
CLOUDFLARE_R2_REGION=auto
CLOUDFLARE_R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

# Security
JWT_SECRET=your_secure_jwt_secret_32_chars_min
ENCRYPTION_KEY=your_32_byte_hex_encryption_key

# OpenAI (Required for AI analysis and essay generation)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

**Important**: All environment variables are now used by the unified Next.js application.

### 2.3 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Note your Vercel deployment URL (e.g., `profilecrafted-xyz.vercel.app`)

## Step 3: Custom Domain Setup

### 3.1 Add Domain to Vercel
1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `profilecrafted.com`)
3. Vercel will provide DNS records to configure

### 3.2 Configure Cloudflare DNS
1. Go to Cloudflare Dashboard → Your Domain → DNS → Records
2. Add the DNS records provided by Vercel:
   - **Type**: CNAME
   - **Name**: @ (or your subdomain)
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: Proxied (orange cloud)

### 3.3 SSL/TLS Configuration
1. Go to Cloudflare Dashboard → SSL/TLS
2. Set encryption mode to "Full (strict)"
3. Enable "Always Use HTTPS"

## Step 4: Cloudflare R2 CORS Configuration

Configure CORS for your R2 bucket to allow frontend access:

```json
[
  {
    "AllowedOrigins": [
      "https://your-domain.com",
      "https://profilecrafted-xyz.vercel.app"
    ],
    "AllowedMethods": [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

## Step 5: Testing Deployment

### 5.1 Test API Endpoints
```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Test status endpoint (check environment variables)
curl https://your-domain.com/api/status

# Test file upload (with actual file)
curl -X POST https://your-domain.com/api/upload \
  -F "resume=@test-resume.pdf" \
  -F "userId=test-user"

# Test AI analysis (after upload)
curl -X POST https://your-domain.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"resumeText":"Your resume text here","fileKey":"uploaded-file-key"}'

# Test essay generation
curl -X POST https://your-domain.com/api/generate-essay \
  -H "Content-Type: application/json" \
  -d '{"analysis":{},"resumeText":"Your resume text","targetLength":400}'
```

### 5.2 Test Full Application Flow
1. Visit your deployed site
2. Upload a PDF resume (should store in Cloudflare R2)
3. View AI analysis results
4. Generate essay using AI
5. Test regeneration with feedback

## Step 6: Monitoring and Optimization

### 6.1 Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and usage

### 6.2 Cloudflare Analytics
- Monitor R2 storage usage
- Set up billing alerts

### 6.3 Error Monitoring
- Check Vercel Function logs
- Monitor Cloudflare R2 access logs

## Troubleshooting

### Common Issues

1. **Build Errors**: Check that all dependencies are installed correctly
2. **Environment Variables**: Verify all required env vars are set in Vercel
3. **CORS Errors**: Ensure R2 CORS is configured correctly
4. **File Upload Fails**: Check R2 credentials and bucket permissions
5. **AI Analysis Fails**: Verify OpenAI API key is valid and has credits
6. **Domain Not Working**: Verify DNS propagation (24-48 hours)

### Debug Commands

```bash
# Check application health and environment
curl -X GET "https://your-domain.com/api/health"

# Check detailed status and missing environment variables
curl -X GET "https://your-domain.com/api/status"

# Test R2 storage with a small file
curl -X POST "https://your-domain.com/api/upload" \
  -F "resume=@small-test.pdf" \
  -F "userId=debug-test"
```

### API Route Architecture

The new unified architecture includes these API routes:
- `/api/health` - Health check and service status
- `/api/status` - Environment validation and readiness check
- `/api/upload` - File upload to Cloudflare R2
- `/api/analyze` - AI-powered resume analysis
- `/api/generate-essay` - AI essay generation
- `/api/regenerate-essay` - Essay regeneration with feedback

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Restrict origins to your domain only
3. **File Types**: Validate file types on both frontend and backend
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **File Size**: Enforce file size limits

## Cost Optimization

1. **R2 Storage**: Monitor storage usage and set lifecycle policies
2. **Vercel Functions**: Optimize function execution time
3. **Cloudflare**: Use appropriate caching settings

## Backup Strategy

1. **Code**: GitHub repository serves as code backup
2. **Files**: Consider R2 cross-region replication for critical files
3. **Environment**: Document all environment variables securely

---

For support, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Next.js Documentation](https://nextjs.org/docs)
