/**
 * PDF Parsing Service for ProfileCrafted
 * Industry-level PDF text extraction using backend API
 */

export interface PDFParseResponse {
  success: boolean;
  text?: string;
  metadata?: {
    pages: number;
    length: number;
    info: any;
    fileName: string;
    fileSize: number;
  };
  error?: string;
  details?: string;
}

class PDFParsingService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * Parse PDF file and extract text using backend API
   * @param file - PDF file to parse
   * @returns Promise with parsed text and metadata
   */
  async parsePDF(file: File): Promise<PDFParseResponse> {
    try {
      // Validate file type
      if (file.type !== 'application/pdf') {
        return {
          success: false,
          error: 'Only PDF files are supported'
        };
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'File size must be less than 10MB'
        };
      }

      console.log('📄 Sending PDF to backend for parsing:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Send to backend API
      const response = await fetch(`${this.apiBaseUrl}/parse-pdf`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ PDF parsing failed:', result);
        return {
          success: false,
          error: result.error || 'Failed to parse PDF',
          details: result.details
        };
      }

      console.log('✅ PDF parsed successfully:', {
        textLength: result.text?.length || 0,
        pages: result.metadata?.pages || 0
      });

      return result;

    } catch (error) {
      console.error('❌ PDF parsing service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error during PDF parsing'
      };
    }
  }

  /**
   * Validate if a file is a supported PDF
   * @param file - File to validate
   * @returns Validation result
   */
  validatePDFFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (file.type !== 'application/pdf') {
      return {
        valid: false,
        error: 'Only PDF files are supported'
      };
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 10MB'
      };
    }

    // Check if file is not empty
    if (file.size === 0) {
      return {
        valid: false,
        error: 'File appears to be empty'
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const pdfParsingService = new PDFParsingService();
export default pdfParsingService;
