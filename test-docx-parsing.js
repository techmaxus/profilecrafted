// Test script for DOCX parsing functionality
// Run with: node test-docx-parsing.js

const fs = require('fs');
const path = require('path');

async function testDocxParsing() {
  console.log('🧪 Testing DOCX parsing functionality...');
  
  try {
    // Import mammoth for testing
    const mammoth = require('mammoth');
    console.log('✅ Mammoth library loaded successfully');
    
    // Check if we have a test DOCX file
    const testDocxPath = path.join(__dirname, 'test-resume.docx');
    
    if (!fs.existsSync(testDocxPath)) {
      console.log('⚠️ No test DOCX file found at:', testDocxPath);
      console.log('📝 To test DOCX parsing:');
      console.log('   1. Create a sample resume in Word');
      console.log('   2. Save it as "test-resume.docx" in the project root');
      console.log('   3. Run this test script again');
      return;
    }
    
    console.log('📄 Found test DOCX file, parsing...');
    
    // Read the DOCX file
    const buffer = fs.readFileSync(testDocxPath);
    console.log('📊 File size:', buffer.length, 'bytes');
    
    // Parse with mammoth
    const result = await mammoth.extractRawText({ buffer });
    
    console.log('✅ DOCX parsing successful!');
    console.log('📝 Extracted text length:', result.value.length);
    console.log('📋 Word count:', result.value.trim().split(/\s+/).length);
    
    if (result.messages && result.messages.length > 0) {
      console.log('⚠️ Parsing messages:', result.messages);
    }
    
    // Show first 500 characters of extracted text
    const preview = result.value.substring(0, 500);
    console.log('👀 Text preview:');
    console.log('─'.repeat(50));
    console.log(preview);
    if (result.value.length > 500) {
      console.log('... (truncated)');
    }
    console.log('─'.repeat(50));
    
    // Test text cleaning (similar to what the API does)
    let cleaned = result.value
      .replace(/\s+/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\u2013|\u2014/g, '-')
      .replace(/\u201C|\u201D/g, '"')
      .replace(/\u2018|\u2019/g, "'")
      .trim();
    
    console.log('🧹 Cleaned text length:', cleaned.length);
    
    // Extract key information
    const emailMatch = cleaned.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = cleaned.match(/[\d\s\-\+\(\)]{10,}/);
    const linkedinMatch = cleaned.match(/linkedin\.com\/in\/[\w-]+/);
    
    console.log('🔍 Extracted information:');
    if (emailMatch) console.log('   📧 Email:', emailMatch[0]);
    if (phoneMatch) console.log('   📞 Phone:', phoneMatch[0].trim());
    if (linkedinMatch) console.log('   🔗 LinkedIn:', linkedinMatch[0]);
    
    console.log('✅ DOCX parsing test completed successfully!');
    
  } catch (error) {
    console.error('❌ DOCX parsing test failed:', error.message);
    
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('💡 Install mammoth with: npm install mammoth');
    }
  }
}

// Run the test
testDocxParsing();
