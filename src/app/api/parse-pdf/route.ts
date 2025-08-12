import { NextRequest, NextResponse } from 'next/server';

// Dynamic import to avoid build-time issues
const getPdfParse = async () => {
  const pdfParse = await import('pdf-parse');
  return pdfParse.default;
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
    
    // Parse PDF using pdf-parse
    console.log('🔍 Extracting text from PDF...');
    const pdfParseFunc = await getPdfParse();
    const pdfData = await pdfParseFunc(buffer, {
      // PDF parsing options for better text extraction
      max: 0, // Parse all pages
      version: 'v1.10.100' // Use stable version
    });
    
    const extractedText = pdfData.text.trim();
    
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
