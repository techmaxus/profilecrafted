/**
 * Local Basic PDF Parsing Test Script
 * Test the regex-based PDF parsing approach (serverless-compatible)
 */

const fs = require('fs');
const path = require('path');

// Basic PDF parsing function (same as in the API)
async function parsePdfRobust(buffer) {
  try {
    const bufferString = buffer.toString('binary');
    
    // Basic PDF text extraction using regex patterns
    const textMatches = bufferString.match(/\(([^)]+)\)/g) || [];
    const streamMatches = bufferString.match(/stream\s*(.*?)\s*endstream/g) || [];
    
    let extractedText = '';
    
    // Extract text from parentheses (common PDF text encoding)
    textMatches.forEach(match => {
      const text = match.slice(1, -1); // Remove parentheses
      if (text.length > 1 && /[a-zA-Z]/.test(text)) {
        extractedText += text + ' ';
      }
    });
    
    // Try to extract readable text from streams
    streamMatches.forEach(match => {
      const streamContent = match.replace(/^stream\s*/, '').replace(/\s*endstream$/, '');
      // Look for readable text patterns
      const readableText = streamContent.match(/[A-Za-z][A-Za-z0-9\s.,!?;:'"()-]{10,}/g) || [];
      readableText.forEach(text => {
        if (text.trim().length > 10) {
          extractedText += text.trim() + ' ';
        }
      });
    });
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?;:'"()-]/g, ' ')
      .trim();
    
    // Estimate page count (rough approximation)
    const pageCount = Math.max(1, Math.floor(buffer.length / 10000));
    
    return {
      text: extractedText,
      numpages: pageCount,
      info: {
        method: 'basic-regex-extraction',
        bufferSize: buffer.length
      }
    };
    
  } catch (error) {
    console.error('Basic PDF parsing failed:', error);
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

async function testBasicPdfParsing() {
  console.log('🧪 Starting Basic PDF parsing test...');
  
  try {
    // Test file path
    const testPdfPath = path.join(__dirname, 'anonymous_1754899092392-c055d8a4158d7322.pdf');
    
    // Check if test file exists
    if (!fs.existsSync(testPdfPath)) {
      console.error('❌ Test PDF file not found:', testPdfPath);
      return;
    }
    
    console.log('✅ Test PDF file found:', testPdfPath);
    console.log('📊 File size:', fs.statSync(testPdfPath).size, 'bytes');
    
    // Read the PDF file
    console.log('📖 Reading PDF file...');
    const pdfBuffer = fs.readFileSync(testPdfPath);
    console.log('✅ PDF file read successfully, buffer size:', pdfBuffer.length);
    
    // Parse the PDF using basic regex approach
    console.log('🔍 Parsing PDF with basic regex approach...');
    const result = await parsePdfRobust(pdfBuffer);
    
    console.log('✅ Basic PDF parsing completed!');
    console.log('📄 Results:');
    console.log('  - Pages (estimated):', result.numpages);
    console.log('  - Text length:', result.text.length);
    console.log('  - Method:', result.info.method);
    console.log('  - Buffer size:', result.info.bufferSize);
    
    if (result.text.length > 0) {
      console.log('📝 First 500 characters of extracted text:');
      console.log(result.text.substring(0, 500));
      console.log('...');
      
      // Check if we extracted meaningful content
      const hasEmail = /\S+@\S+\.\S+/.test(result.text);
      const hasPhone = /\d{3,}/.test(result.text);
      const hasWords = result.text.split(' ').length > 10;
      
      console.log('🔍 Content analysis:');
      console.log('  - Contains email:', hasEmail ? '✅' : '❌');
      console.log('  - Contains phone numbers:', hasPhone ? '✅' : '❌');
      console.log('  - Has sufficient words:', hasWords ? '✅' : '❌');
      
      const isUseful = hasEmail || hasPhone || hasWords;
      console.log('  - Overall usefulness:', isUseful ? '✅ GOOD' : '❌ POOR');
      
      return {
        success: true,
        ...result,
        isUseful
      };
    } else {
      console.log('❌ No text extracted - this approach may not work for this PDF');
      return {
        success: false,
        error: 'No text extracted'
      };
    }
    
  } catch (error) {
    console.error('❌ Basic PDF parsing test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testBasicPdfParsing()
  .then(result => {
    if (result.success && result.isUseful) {
      console.log('\n🎉 Basic PDF parsing test completed successfully!');
      console.log('✅ Ready for production deployment');
    } else if (result.success && !result.isUseful) {
      console.log('\n⚠️ Basic PDF parsing works but extracts limited content');
      console.log('💡 Consider implementing a more advanced solution for better results');
    } else {
      console.log('\n💥 Basic PDF parsing test failed!');
      console.log('❌ Need to implement a different approach');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Unexpected error during test:', error);
    process.exit(1);
  });
