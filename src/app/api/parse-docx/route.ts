import { NextRequest, NextResponse } from 'next/server';

// DOCX text cleaning function
const cleanDocxText = (text: string): string => {
  console.log('🧹 Cleaning DOCX extracted text...');
  
  let cleaned = text;
  
  // Remove common DOCX artifacts and improve formatting
  cleaned = cleaned
    // Remove excessive whitespace and normalize
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    
    // Clean up common Word artifacts
    .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
    .replace(/\u2013|\u2014/g, '-') // Replace em/en dashes with hyphens
    .replace(/\u201C|\u201D/g, '"') // Replace smart quotes
    .replace(/\u2018|\u2019/g, "'") // Replace smart apostrophes
    
    // Remove page numbers and headers/footers artifacts
    .replace(/Page \d+ of \d+/gi, '')
    .replace(/^\d+\s*$/gm, '') // Remove standalone numbers (page numbers)
    
    // Clean email and URL formatting
    .replace(/mailto:/gi, '')
    .replace(/HYPERLINK\s+"([^"]+)"/gi, '$1')
    
    // Improve spacing around punctuation
    .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces in camelCase
    
    // Final cleanup
    .trim();
  
  // Extract and prioritize key information (similar to PDF)
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\d\s\-\+\(\)]{10,}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/);
  
  // Reconstruct with key info first
  let reconstructed = '';
  if (emailMatch) reconstructed += `Email: ${emailMatch[0]} `;
  if (phoneMatch) reconstructed += `Phone: ${phoneMatch[0].trim()} `;
  if (linkedinMatch) reconstructed += `LinkedIn: ${linkedinMatch[0]} `;
  
  // Add cleaned main content
  reconstructed += cleaned;
  
  console.log(`✅ DOCX text cleaned: ${text.length} → ${reconstructed.length} characters`);
  return reconstructed.trim();
};

// Production-ready DOCX parsing with fallback strategies
const parseDocxProduction = async (buffer: Buffer): Promise<{ text: string; info: Record<string, unknown> }> => {
  console.log('🔧 Starting production DOCX parsing...');
  
  try {
    // Primary strategy: Use mammoth for clean text extraction
    const mammoth = (await import('mammoth')).default;
    
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.value && result.value.trim().length > 50) {
      console.log('✅ DOCX parsed successfully with mammoth');
      return {
        text: result.value.trim(),
        info: {
          method: 'mammoth',
          version: 'production',
          messages: result.messages,
          wordCount: result.value.trim().split(/\s+/).length
        }
      };
    }
    
    console.log('⚠️ Mammoth extraction resulted in insufficient text, trying fallback...');
  } catch (error) {
    console.error('❌ Mammoth parsing failed:', error);
  }
  
  // Fallback strategy: Basic buffer text extraction
  try {
    console.log('🔄 Attempting fallback DOCX parsing...');
    
    // Convert buffer to string and extract readable text
    const bufferText = buffer.toString('utf8');
    
    // Extract text between XML-like tags (DOCX is essentially XML)
    const textMatches = bufferText.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    
    if (textMatches && textMatches.length > 0) {
      const extractedText = textMatches
        .map(match => match.replace(/<w:t[^>]*>([^<]+)<\/w:t>/, '$1'))
        .join(' ')
        .trim();
      
      if (extractedText.length > 50) {
        console.log('✅ DOCX fallback parsing successful');
        return {
          text: extractedText,
          info: {
            method: 'fallback-xml',
            version: 'production',
            extractedSegments: textMatches.length
          }
        };
      }
    }
    
    console.log('⚠️ Fallback extraction insufficient, trying basic text extraction...');
  } catch (error) {
    console.error('❌ Fallback DOCX parsing failed:', error);
  }
  
  // Last resort: Basic text extraction
  try {
    const basicText = buffer.toString('utf8')
      .replace(/[^\x20-\x7E\n\r]/g, ' ') // Keep only printable ASCII
      .replace(/\s+/g, ' ')
      .trim();
    
    if (basicText.length > 50) {
      console.log('⚠️ Using basic text extraction as last resort');
      return {
        text: basicText,
        info: {
          method: 'basic-text',
          version: 'production',
          note: 'Last resort extraction'
        }
      };
    }
  } catch (error) {
    console.error('❌ Basic text extraction failed:', error);
  }
  
  throw new Error('All DOCX parsing strategies failed');
};

export async function POST(request: NextRequest) {
  console.log('📄 DOCX parsing API called');
  
  try {
    // Get the uploaded file
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('❌ No file provided in request');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a DOCX file.' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }
    
    console.log('📋 Processing DOCX file:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('🔍 Extracting text from DOCX...');
    const docxData = await parseDocxProduction(buffer);
    
    let extractedText = docxData.text.trim();
    
    // Advanced text cleaning and post-processing
    extractedText = cleanDocxText(extractedText);
    
    // Validate extracted text
    if (!extractedText || extractedText.length < 50) {
      console.error('❌ Insufficient text extracted from DOCX');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unable to extract sufficient text from DOCX file. Please ensure the document contains readable text.' 
        },
        { status: 400 }
      );
    }
    
    console.log('✅ DOCX parsing completed successfully:', {
      textLength: extractedText.length,
      method: docxData.info.method,
      fileName: file.name
    });
    
    return NextResponse.json({
      success: true,
      text: extractedText,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        textLength: extractedText.length,
        parsingMethod: docxData.info.method,
        ...docxData.info
      }
    });
    
  } catch (error) {
    console.error('❌ DOCX parsing error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to parse DOCX file' 
      },
      { status: 500 }
    );
  }
}

// Handle CORS for browser requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
