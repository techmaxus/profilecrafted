const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
const path = require('path');

class CloudflareR2Service {
  constructor() {
    this.client = new S3Client({
      region: process.env.CLOUDFLARE_R2_REGION || 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
    
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  }

  /**
   * Upload a file to Cloudflare R2
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} originalName - Original filename
   * @param {string} mimeType - File MIME type
   * @param {string} userId - User identifier for organizing files
   * @returns {Promise<Object>} Upload result with key and URL
   */
  async uploadFile(fileBuffer, originalName, mimeType, userId = 'anonymous') {
    try {
      // Generate unique filename
      const fileExtension = path.extname(originalName);
      const timestamp = Date.now();
      const randomId = crypto.randomBytes(8).toString('hex');
      const fileName = `${userId}/${timestamp}-${randomId}${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
        Metadata: {
          originalName: originalName,
          uploadedAt: new Date().toISOString(),
          userId: userId,
        },
      });

      await this.client.send(command);

      return {
        success: true,
        key: fileName,
        url: `${process.env.CLOUDFLARE_R2_ENDPOINT}/${this.bucketName}/${fileName}`,
        originalName: originalName,
        size: fileBuffer.length,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error uploading to R2:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Get a signed URL for downloading a file
   * @param {string} key - File key in R2
   * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
   * @returns {Promise<string>} Signed URL
   */
  async getSignedDownloadUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error(`Failed to generate download URL: ${error.message}`);
    }
  }

  /**
   * Delete a file from R2
   * @param {string} key - File key in R2
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting from R2:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Get file metadata
   * @param {string} key - File key in R2
   * @returns {Promise<Object>} File metadata
   */
  async getFileMetadata(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.client.send(command);
      return {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        metadata: response.Metadata,
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }

  /**
   * Check if R2 connection is working
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      // Try to list objects in the bucket (limit to 1 to minimize data transfer)
      const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 1,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('R2 connection test failed:', error);
      return false;
    }
  }
}

module.exports = CloudflareR2Service;
