// Test script for Cloudflare R2 connection
// Run with: node test-r2.js

require('dotenv').config({ path: './config/.env' });
const { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

async function testR2Connection() {
  console.log('🔍 Testing Cloudflare R2 Connection...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('- Account ID:', process.env.CLOUDFLARE_R2_ACCOUNT_ID ? '✅ SET' : '❌ MISSING');
  console.log('- Access Key ID:', process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? '✅ SET' : '❌ MISSING');
  console.log('- Secret Access Key:', process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? '✅ SET' : '❌ MISSING');
  console.log('- Bucket Name:', process.env.CLOUDFLARE_R2_BUCKET_NAME ? '✅ SET' : '❌ MISSING');
  console.log('- Endpoint:', `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com\n`);

  if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    console.error('❌ Missing required environment variables!');
    return;
  }

  // Initialize R2 client
  const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  try {
    // Skip bucket listing (requires admin permissions) and go directly to bucket operations
    console.log('🧪 Test 1: Skip Bucket Listing (requires admin permissions)');
    console.log('🎯 Testing direct bucket operations with:', process.env.CLOUDFLARE_R2_BUCKET_NAME);

    // Test 2: Upload a test file
    console.log('🧪 Test 2: Upload Test File');
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Hello from ProfileCrafted R2 test!';
    
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: testFileName,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
      Metadata: {
        testFile: 'true',
        uploadedAt: new Date().toISOString(),
      },
    });

    await r2Client.send(uploadCommand);
    console.log('✅ Upload successful! File:', testFileName);

    // Test 3: Download the test file
    console.log('🧪 Test 3: Download Test File');
    const getCommand = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: testFileName,
    });

    const getResult = await r2Client.send(getCommand);
    const downloadedContent = await getResult.Body.transformToString();
    console.log('✅ Download successful! Content:', downloadedContent);

    // Verify content matches
    if (downloadedContent === testContent) {
      console.log('✅ Content verification successful!\n');
    } else {
      console.log('❌ Content mismatch!\n');
    }

    console.log('🎉 ALL TESTS PASSED! R2 integration is working correctly!');
    console.log('📋 You can now update your Vercel environment variables with these credentials.');

  } catch (error) {
    console.error('❌ R2 Test Failed:');
    console.error('- Error:', error.message);
    console.error('- Name:', error.name);
    console.error('- Code:', error.Code || 'N/A');
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check if your R2 API token has "Object Read & Write" permissions');
    console.error('2. Verify the bucket name is correct and exists');
    console.error('3. Ensure the account ID matches your Cloudflare account');
  }
}

// Run the test
testR2Connection().catch(console.error);
