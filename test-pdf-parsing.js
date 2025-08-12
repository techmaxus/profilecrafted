/**
 * Local PDF Parsing Test Script
 * Run this to test PDF parsing functionality before deploying
 */

const fs = require('fs');
const path = require('path');

async function testPdfParsing() {
  console.log('🧪 Starting PDF parsing test...');
  
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
    
    // Try to import pdf-parse
    console.log('📦 Importing pdf-parse...');
    const pdfParse = require('pdf-parse');
    console.log('✅ pdf-parse imported successfully');
    
    // Read the PDF file
    console.log('📖 Reading PDF file...');
    const pdfBuffer = fs.readFileSync(testPdfPath);
    console.log('✅ PDF file read successfully, buffer size:', pdfBuffer.length);
    
    // Parse the PDF
    console.log('🔍 Parsing PDF...');
    const pdfData = await pdfParse(pdfBuffer, {
      max: 0, // Parse all pages
    });
    
    console.log('✅ PDF parsed successfully!');
    console.log('📄 Results:');
    console.log('  - Pages:', pdfData.numpages);
    console.log('  - Text length:', pdfData.text.length);
    console.log('  - Info:', JSON.stringify(pdfData.info, null, 2));
    console.log('📝 First 500 characters of extracted text:');
    console.log(pdfData.text.substring(0, 500));
    console.log('...');
    
    return {
      success: true,
      pages: pdfData.numpages,
      textLength: pdfData.text.length,
      text: pdfData.text,
      info: pdfData.info
    };
    
  } catch (error) {
    console.error('❌ PDF parsing test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testPdfParsing()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 PDF parsing test completed successfully!');
    } else {
      console.log('\n💥 PDF parsing test failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Unexpected error during test:', error);
    process.exit(1);
  });
