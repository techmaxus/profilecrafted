/**
 * Upload Service for ProfileCrafted
 * Handles file uploads to Cloudflare R2 via backend API
 */

export interface UploadResponse {
  success: boolean;
  key?: string;
  url?: string;
  originalName?: string;
  size?: number;
  uploadedAt?: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class UploadService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * Upload a file to Cloudflare R2 storage
   * @param file - File to upload
   * @param onProgress - Progress callback
   * @returns Promise with upload result
   */
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Create form data
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('userId', this.generateUserId());

      // Create XMLHttpRequest for progress tracking
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress: UploadProgress = {
                loaded: event.loaded,
                total: event.total,
                percentage: Math.round((event.loaded / event.total) * 100)
              };
              onProgress(progress);
            }
          });
        }

        // Handle completion
        xhr.addEventListener('load', () => {
          try {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
              resolve(response);
            } else {
              resolve({
                success: false,
                error: response.error || 'Upload failed'
              });
            }
          } catch {
            resolve({
              success: false,
              error: 'Invalid response from server'
            });
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          resolve({
            success: false,
            error: 'Network error during upload'
          });
        });

        // Handle timeout
        xhr.addEventListener('timeout', () => {
          resolve({
            success: false,
            error: 'Upload timeout'
          });
        });

        // Configure and send request
        xhr.open('POST', `${this.apiBaseUrl}/upload`);
        xhr.timeout = 60000; // 60 second timeout
        xhr.send(formData);
      });

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Validate file before upload
   * @param file - File to validate
   * @returns Validation result
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 5MB'
      };
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only PDF and DOCX files are allowed'
      };
    }

    return { valid: true };
  }

  /**
   * Generate a unique user ID for file organization
   * @returns User ID string
   */
  private generateUserId(): string {
    // In a real app, this would come from user authentication
    // For now, generate a session-based ID
    let userId = sessionStorage.getItem('profilecrafted_user_id');
    
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('profilecrafted_user_id', userId);
    }
    
    return userId;
  }

  /**
   * Get download URL for a file
   * @param fileKey - File key in R2 storage
   * @returns Promise with download URL
   */
  async getDownloadUrl(fileKey: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/download/${encodeURIComponent(fileKey)}`);
      
      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }
      
      const data = await response.json();
      return data.url || null;
    } catch (error) {
      console.error('Error getting download URL:', error);
      return null;
    }
  }

  /**
   * Delete a file from storage
   * @param fileKey - File key in R2 storage
   * @returns Promise with deletion result
   */
  async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/delete/${encodeURIComponent(fileKey)}`, {
        method: 'DELETE'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService();
export default uploadService;
