/**
 * Google Cloud Storage Service
 * 
 * For storing audio files, user-generated content, and community attachments
 */

interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  public?: boolean;
  cacheControl?: string;
}

interface FileMetadata {
  name: string;
  bucket: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  publicUrl?: string;
}

class GoogleCloudStorageService {
  private proxyUrl: string | null;
  private bucketName: string;

  constructor() {
    this.proxyUrl = process.env.REACT_APP_GOOGLE_CLOUD_PROXY_URL || null;
    this.bucketName = process.env.REACT_APP_GOOGLE_CLOUD_STORAGE_BUCKET || 'mindbloom-app-storage';
  }

  /**
   * Upload a file to Cloud Storage
   */
  async uploadFile(
    file: File | Blob,
    path: string,
    options?: UploadOptions
  ): Promise<FileMetadata> {
    if (!this.proxyUrl) {
      throw new Error('Google Cloud Storage proxy not configured. Please set REACT_APP_GOOGLE_CLOUD_PROXY_URL');
    }

    // Convert file to base64
    const base64 = await this.blobToBase64(file);

    const response = await fetch(`${this.proxyUrl}/storage/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucket: this.bucketName,
        path,
        file: base64.split(',')[1], // Remove data:...;base64, prefix
        contentType: options?.contentType || file.type || 'application/octet-stream',
        metadata: options?.metadata || {},
        makePublic: options?.public || false,
        cacheControl: options?.cacheControl || 'public, max-age=3600',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Storage upload error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Get download URL for a file
   */
  async getDownloadUrl(path: string, expiresIn?: number): Promise<string> {
    if (!this.proxyUrl) {
      throw new Error('Google Cloud Storage proxy not configured');
    }

    const response = await fetch(`${this.proxyUrl}/storage/get-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucket: this.bucketName,
        path,
        expiresIn: expiresIn || 3600, // Default 1 hour
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Get download URL error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.url;
  }

  /**
   * Delete a file
   */
  async deleteFile(path: string): Promise<void> {
    if (!this.proxyUrl) {
      throw new Error('Google Cloud Storage proxy not configured');
    }

    const response = await fetch(`${this.proxyUrl}/storage/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucket: this.bucketName,
        path,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Delete file error: ${response.status} - ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(prefix?: string, maxResults?: number): Promise<FileMetadata[]> {
    if (!this.proxyUrl) {
      throw new Error('Google Cloud Storage proxy not configured');
    }

    const response = await fetch(`${this.proxyUrl}/storage/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucket: this.bucketName,
        prefix: prefix || '',
        maxResults: maxResults || 100,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`List files error: ${response.status} - ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.files || [];
  }

  /**
   * Upload audio file for TTS output or user recordings
   */
  async uploadAudio(audioBlob: Blob, userId: string, type: 'tts' | 'recording' | 'story' | 'wellness', filename?: string): Promise<string> {
    const timestamp = Date.now();
    const extension = audioBlob.type.includes('mpeg') ? 'mp3' : audioBlob.type.split('/')[1] || 'webm';
    const path = `audio/${userId}/${type}/${filename || `${timestamp}.${extension}`}`;

    const metadata = await this.uploadFile(audioBlob, path, {
      contentType: audioBlob.type,
      metadata: {
        userId,
        type,
        uploadedAt: new Date().toISOString(),
      },
      public: type === 'story', // Stories are public, others are private
    });

    return metadata.publicUrl || await this.getDownloadUrl(path);
  }

  /**
   * Upload user-generated image (for community stories, etc.)
   */
  async uploadImage(imageBlob: Blob, userId: string, type: 'avatar' | 'story' | 'garden', filename?: string): Promise<string> {
    const timestamp = Date.now();
    const extension = imageBlob.type.split('/')[1] || 'png';
    const path = `images/${userId}/${type}/${filename || `${timestamp}.${extension}`}`;

    const metadata = await this.uploadFile(imageBlob, path, {
      contentType: imageBlob.type,
      metadata: {
        userId,
        type,
        uploadedAt: new Date().toISOString(),
      },
      public: true, // Images are generally public
      cacheControl: 'public, max-age=31536000', // 1 year cache
    });

    return metadata.publicUrl || await this.getDownloadUrl(path);
  }

  /**
   * Convert blob to base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

// Export singleton instance
export const googleCloudStorageService = new GoogleCloudStorageService();
export default GoogleCloudStorageService;

