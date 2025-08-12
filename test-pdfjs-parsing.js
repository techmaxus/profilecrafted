/**
 * Local PDF.js Parsing Test Script
 * Test the serverless-compatible PDF parsing approach
 */

const fs = require('fs');
const path = require('path');

async function testPdfJsParsing() {
  console.log('🧪 Starting PDF.js parsing test...');
  
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
    
    // Try to import pdfjs-dist
    console.log('📦 Importing pdfjs-dist...');
    const pdfjsLib = require('pdfjs-dist');
    console.log('✅ pdfjs-dist imported successfully');
    
    // Read the PDF file
    console.log('📖 Reading PDF file...');
    const pdfBuffer = fs.readFileSync(testPdfPath);
    console.log('✅ PDF file read successfully, buffer size:', pdfBuffer.length);
    
    // Parse the PDF using PDF.js
    console.log('🔍 Parsing PDF with PDF.js...');
    
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      disableFontFace: true,
      verbosity: 0
    }).promise;
    
    console.log('✅ PDF document loaded successfully');
    console.log('📄 Number of pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`📖 Processing page ${pageNum}/${pdf.numPages}...`);
      
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ');
      
      fullText += pageText + '\n';
      console.log(`✅ Page ${pageNum} processed, extracted ${pageText.length} characters`);
    }
    
    const finalText = fullText.trim();
    
    console.log('✅ PDF.js parsing completed successfully!');
    console.log('📄 Results:');
    console.log('  - Pages:', pdf.numPages);
    console.log('  - Text length:', finalText.length);
    console.log('📝 First 500 characters of extracted text:');
    console.log(finalText.substring(0, 500));
    console.log('...');
    
    return {
      success: true,
      pages: pdf.numPages,
      textLength: finalText.length,
      text: finalText
    };
    
  } catch (error) {
    console.error('❌ PDF.js parsing test failed:', error);
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
testPdfJsParsing()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 PDF.js parsing test completed successfully!');
      console.log('✅ Ready for production deployment');
    } else {
      console.log('\n💥 PDF.js parsing test failed!');
      console.log('❌ Do not deploy until this is fixed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Unexpected error during test:', error);
    process.exit(1);
  });
