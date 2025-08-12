// DOCX Parsing Service
// Handles DOCX file parsing by sending files to the backend API

interface DocxParseResult {
  success: boolean;
  text?: string;
  error?: string;
  metadata?: {
    fileName: string;
    fileSize: number;
    textLength: number;
    parsingMethod: string;
    wordCount?: number;
    messages?: unknown[];
  };
}

class DocxParsingService {
  private static instance: DocxParsingService;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  public static getInstance(): DocxParsingService {
    if (!DocxParsingService.instance) {
      DocxParsingService.instance = new DocxParsingService();
    }
    return DocxParsingService.instance;
  }

  /**
   * Validates DOCX file before parsing
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return {
        valid: false,
        error: 'Invalid file type. Please upload a DOCX file.'
      };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File too large. Maximum size is 10MB.'
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        valid: false,
        error: 'File is empty.'
      };
    }

    return { valid: true };
  }

  /**
   * Parse DOCX file and extract text content
   */
  public async parseDocx(file: File): Promise<DocxParseResult> {
    console.log('📄 DocxParsingService: Starting DOCX parsing...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    try {
      // Validate file first
      const validation = this.validateFile(file);
      if (!validation.valid) {
        console.error('❌ DOCX file validation failed:', validation.error);
        return {
          success: false,
          error: validation.error
        };
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);

      console.log('🚀 Sending DOCX to backend for parsing...');

      // Send to backend API
      const response = await fetch(`${this.baseUrl}/parse-docx`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        
        console.error('❌ Backend DOCX parsing failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage
        });

        return {
          success: false,
          error: `Failed to parse DOCX: ${errorMessage}`
        };
      }

      const result = await response.json();

      if (!result.success) {
        console.error('❌ DOCX parsing unsuccessful:', result.error);
        return {
          success: false,
          error: result.error || 'Unknown parsing error'
        };
      }

      console.log('✅ DOCX parsing successful:', {
        textLength: result.text?.length || 0,
        method: result.metadata?.parsingMethod,
        fileName: result.metadata?.fileName
      });

      return {
        success: true,
        text: result.text,
        metadata: result.metadata
      };

    } catch (error) {
      console.error('❌ DocxParsingService error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred during DOCX parsing';

      return {
        success: false,
        error: `DOCX parsing failed: ${errorMessage}`
      };
    }
  }

  /**
   * Check if a file is a valid DOCX file
   */
  public isDocxFile(file: File): boolean {
    return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
           file.name.toLowerCase().endsWith('.docx');
  }

  /**
   * Get supported file extensions
   */
  public getSupportedExtensions(): string[] {
    return ['.docx'];
  }

  /**
   * Get supported MIME types
   */
  public getSupportedMimeTypes(): string[] {
    return ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  }
}

// Export singleton instance
const docxParsingService = DocxParsingService.getInstance();
export default docxParsingService;
