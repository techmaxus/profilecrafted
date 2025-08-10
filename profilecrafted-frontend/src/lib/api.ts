import { config } from './config';

const API_BASE_URL = config.api.baseUrl;

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

export const api = {
  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`${API_BASE_URL}/api/upload-resume`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.error || 'Upload failed', response.status);
    }

    return response.json();
  },

  async generateEssay(scores: any, sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/api/generate-essay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scores, sessionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.error || 'Essay generation failed', response.status);
    }

    return response.json();
  },

  async regenerateEssay(scores: any, sessionId: string) {
    // Use the same generate-essay endpoint for regeneration
    const response = await fetch(`${API_BASE_URL}/api/generate-essay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scores, sessionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.error || 'Essay regeneration failed', response.status);
    }

    return response.json();
  },

  async sendEmail(email: string, essay: string) {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, essay }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.error || 'Email sending failed', response.status);
    }

    return response.json();
  },
};
