import { NextRequest, NextResponse } from 'next/server';

// Advanced text cleaning function to improve PDF extraction quality
const cleanExtractedText = (text: string): string => {
  console.log('🧹 Cleaning extracted text...');
  
  let cleaned = text;
  
  // Remove common PDF artifacts and garbled characters
  cleaned = cleaned
    // Remove PDF metadata and technical strings
    .replace(/D:\d{14}Z/g, '') // Remove date stamps like D:20250706155736Z
    .replace(/Apache FOP Version [\d.]+/g, '') // Remove Apache FOP version info
    .replace(/Resume LinkedIn Resume generated from profile/g, 'Resume') // Clean LinkedIn header
    .replace(/mailto:/g, '') // Clean email prefixes
    .replace(/https?:\/\/[^\s]+/g, (url) => {
      // Clean up URLs but keep readable parts
      if (url.includes('linkedin.com')) return 'LinkedIn Profile';
      if (url.includes('github.com')) return 'GitHub Profile';
      return url.split('/').pop() || url;
    })
    
    // Remove single characters and short meaningless sequences
    .replace(/\b[A-Za-z]\b/g, ' ') // Remove single letters
    .replace(/\b\d{1,2}\b/g, ' ') // Remove short numbers
    .replace(/[!@#$%^&*()_+=\[\]{}|;':",./<>?`~]/g, ' ') // Remove special chars
    
    // Clean up garbled character sequences
    .replace(/[^\w\s@.-]/g, ' ') // Keep only alphanumeric, spaces, @, ., -
    .replace(/\b[A-Za-z0-9]{1,2}\b/g, ' ') // Remove very short words
    .replace(/\s+/g, ' ') // Normalize whitespace
    
    // Remove common PDF encoding artifacts
    .replace(/\b(urn|3Ali|3A|lipi|jobid|3D)\b/gi, ' ') // Remove LinkedIn encoding artifacts
    .replace(/\b[A-Z]{2,}\b/g, (match) => {
      // Keep meaningful acronyms but remove random caps
      const meaningful = ['PDF', 'API', 'UI', 'UX', 'CEO', 'CTO', 'MBA', 'PhD', 'USA', 'UK'];
      return meaningful.includes(match) ? match : ' ';
    })
    
    // Improve readability
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces between camelCase
    .replace(/(\d)([A-Za-z])/g, '$1 $2') // Add spaces between numbers and letters
    .replace(/([A-Za-z])(\d)/g, '$1 $2') // Add spaces between letters and numbers
    
    // Final cleanup
    .replace(/\s+/g, ' ') // Final whitespace normalization
    .trim();
  
  // Extract and prioritize key information
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
  
  console.log(`✅ Text cleaned: ${text.length} → ${reconstructed.length} characters`);
  return reconstructed.trim();
};

// Production-ready PDF parsing with multiple strategies and fallbacks
const parsePdfProduction = async (buffer: Buffer): Promise<{ text: string; numpages: number; info: Record<string, unknown> }> => {
  console.log('🔧 Starting production PDF parsing...');
  
  // Strategy 1: Try pdf-parse with error handling
  try {
    console.log('📦 Attempting pdf-parse strategy...');
    const pdfParse = (await import('pdf-parse')).default;
    const result = await pdfParse(buffer, {
      max: 0 // Parse all pages
    });
    
    if (result.text && result.text.trim().length > 50) {
      console.log('✅ pdf-parse successful');
      return {
        text: result.text.trim(),
        numpages: result.numpages,
        info: {
          method: 'pdf-parse',
          version: 'production',
          ...result.info
        }
      };
    }
  } catch (error) {
    console.log('❌ pdf-parse failed:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Strategy 2: Enhanced regex-based extraction
  try {
    console.log('🔍 Attempting enhanced regex strategy...');
    const bufferString = buffer.toString('binary');
    let extractedText = '';
    
    // Extract text from various PDF structures
    const patterns = [
      /\(([^)]+)\)/g,                           // Text in parentheses
      /\/Title\s*\(([^)]+)\)/g,                 // Document title
      /\/Author\s*\(([^)]+)\)/g,                // Document author
      /\/Subject\s*\(([^)]+)\)/g,               // Document subject
      /BT\s*(.*?)\s*ET/g,                       // Text objects
      /Tj\s*\[\s*\(([^)]+)\)\s*\]/g,           // Text showing operators
      />\s*([A-Za-z][A-Za-z0-9\s.,!?;:'"()\-]{5,})\s*</g // Text between brackets
    ];
    
    patterns.forEach(pattern => {
      const matches = bufferString.match(pattern) || [];
      matches.forEach(match => {
        let text = match;
        
        // Clean up based on pattern type
        if (pattern.source.includes('\\(')) {
          text = match.replace(/.*\(([^)]+)\).*/, '$1');
        } else if (pattern.source.includes('BT')) {
          text = match.replace(/BT\s*/, '').replace(/\s*ET/, '');
        }
        
        // Validate and add text
        if (text && text.length > 2 && /[a-zA-Z]/.test(text)) {
          // Decode common PDF escape sequences
          text = text
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\\(/g, '(')
            .replace(/\\\)/g, ')')
            .replace(/\\\\/g, '\\');
          
          if (text.trim().length > 2) {
            extractedText += text.trim() + ' ';
          }
        }
      });
    });
    
    // Additional extraction from streams with better handling
    const streamMatches = bufferString.match(/stream\s*([\s\S]*?)\s*endstream/g) || [];
    streamMatches.forEach(match => {
      const streamContent = match.replace(/^stream\s*/, '').replace(/\s*endstream$/, '');
      
      // Try to find readable text in streams
      const readableChunks = streamContent.match(/[A-Za-z][A-Za-z0-9\s.,!?;:'"()\-@]{8,}/g) || [];
      readableChunks.forEach(chunk => {
        const cleaned = chunk.trim();
        if (cleaned.length > 8 && /[a-zA-Z].*[a-zA-Z]/.test(cleaned)) {
          extractedText += cleaned + ' ';
        }
      });
    });
    
    // Clean and normalize the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')                     // Normalize whitespace
      .replace(/[^\w\s.,!?;:'"()\-@]/g, ' ')    // Remove non-printable chars
      .replace(/\s+/g, ' ')                     // Final whitespace cleanup
      .trim();
    
    // Estimate page count more accurately
    const pageIndicators = bufferString.match(/\/Type\s*\/Page[^s]/g) || [];
    const pageCount = Math.max(1, pageIndicators.length || Math.floor(buffer.length / 15000));
    
    if (extractedText.length > 50) {
      console.log('✅ Enhanced regex extraction successful');
      return {
        text: extractedText,
        numpages: pageCount,
        info: {
          method: 'enhanced-regex',
          bufferSize: buffer.length,
          patternsUsed: patterns.length,
          streamsProcessed: streamMatches.length
        }
      };
    }
  } catch (error) {
    console.log('❌ Enhanced regex failed:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Strategy 3: Basic fallback extraction
  try {
    console.log('🔄 Attempting basic fallback strategy...');
    const bufferString = buffer.toString('utf8', 0, Math.min(buffer.length, 50000));
    
    // Look for any readable text patterns
    const readableText = bufferString.match(/[A-Za-z][A-Za-z0-9\s.,!?;:'"()\-@]{10,}/g) || [];
    const extractedText = readableText
      .filter(text => text.trim().length > 10)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (extractedText.length > 30) {
      console.log('✅ Basic fallback extraction successful');
      return {
        text: extractedText,
        numpages: Math.max(1, Math.floor(buffer.length / 20000)),
        info: {
          method: 'basic-fallback',
          bufferSize: buffer.length,
          warning: 'Limited extraction - consider using a more advanced PDF parser'
        }
      };
    }
  } catch (error) {
    console.log('❌ Basic fallback failed:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // If all strategies fail, throw an error
  throw new Error('All PDF parsing strategies failed. The PDF may be corrupted, password-protected, or contain only images.');
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('📄 PDF parsing API called');
    
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('❌ No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size);
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    console.log('📋 Processing PDF:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parse PDF using production-ready multi-strategy approach
    console.log('🔍 Extracting text from PDF...');
    const pdfData = await parsePdfProduction(buffer);
    
    let extractedText = pdfData.text.trim();
    
    // Advanced text cleaning and post-processing
    extractedText = cleanExtractedText(extractedText);
    
    // Validate extracted text
    if (!extractedText || extractedText.length < 50) {
      console.log('❌ Insufficient text extracted:', extractedText.length);
      return NextResponse.json(
        { 
          error: 'Could not extract sufficient text from PDF. Please ensure the PDF contains readable text and is not image-based.',
          extractedLength: extractedText.length
        },
        { status: 400, headers: corsHeaders }
      );
    }
    
    console.log('✅ PDF text extracted successfully:', {
      originalLength: extractedText.length,
      pages: pdfData.numpages,
      info: pdfData.info
    });
    
    // Return extracted text and metadata
    return NextResponse.json(
      {
        success: true,
        text: extractedText,
        metadata: {
          pages: pdfData.numpages,
          length: extractedText.length,
          info: pdfData.info,
          fileName: file.name,
          fileSize: file.size
        }
      },
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );
    
  } catch (error) {
    console.error('❌ PDF parsing failed:', error);
    
    // Provide detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isParsingError = errorMessage.includes('PDF') || errorMessage.includes('parse');
    
    return NextResponse.json(
      {
        error: isParsingError 
          ? 'Failed to parse PDF. The file may be corrupted, password-protected, or contain only images.'
          : 'Internal server error during PDF processing',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
}
