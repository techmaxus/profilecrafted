#!/usr/bin/env node

/**
 * Vercel Deployment Script for ProfileCrafted
 * Handles pre-deployment setup and validation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting ProfileCrafted Vercel deployment preparation...');

// Check if we're in the correct directory
const projectRoot = process.cwd();
const frontendPath = path.join(projectRoot, 'profilecrafted-frontend');
const backendPath = path.join(projectRoot, 'profilecrafted-backend');

// Validate project structure
if (!fs.existsSync(frontendPath)) {
  console.error('❌ Frontend directory not found. Please run from project root.');
  process.exit(1);
}

if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found. Please run from project root.');
  process.exit(1);
}

console.log('✅ Project structure validated');

// Check for required environment variables
const requiredEnvVars = [
  'CLOUDFLARE_R2_ACCOUNT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME',
  'JWT_SECRET',
  'ENCRYPTION_KEY'
];

console.log('🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('⚠️  Missing environment variables:');
  missingVars.forEach(varName => console.warn(`   - ${varName}`));
  console.warn('   Make sure to set these in Vercel dashboard before deployment.');
}

// Install dependencies
console.log('📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: frontendPath, stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies:', error.message);
  process.exit(1);
}

console.log('📦 Installing backend dependencies...');
try {
  execSync('npm install', { cwd: backendPath, stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error.message);
  process.exit(1);
}

// Build frontend
console.log('🏗️  Building frontend...');
try {
  execSync('npm run build', { cwd: frontendPath, stdio: 'inherit' });
  console.log('✅ Frontend build completed');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}

// Validate build output
const buildPath = path.join(frontendPath, '.next');
if (!fs.existsSync(buildPath)) {
  console.error('❌ Build output not found. Build may have failed.');
  process.exit(1);
}

console.log('✅ Build validation passed');

// Create deployment summary
console.log('\n📋 Deployment Summary:');
console.log('   Frontend: Next.js application');
console.log('   Backend: Node.js/Express API');
console.log('   Storage: Cloudflare R2');
console.log('   Domain: Custom domain via Cloudflare');

console.log('\n🎉 Deployment preparation completed successfully!');
console.log('\nNext steps:');
console.log('1. Push changes to GitHub');
console.log('2. Connect repository to Vercel');
console.log('3. Configure environment variables in Vercel');
console.log('4. Deploy and configure custom domain');
console.log('\nSee DEPLOYMENT.md for detailed instructions.');
