/**
 * ImgBB Image Upload Service
 * Handles uploading images and videos to ImgBB for reference/storage
 */

export interface ImgBBUploadResponse {
  data: {
    id: string
    title: string
    url_viewer: string
    url: string
    display_url: string
    width: string
    height: string
    size: string
    time: string
    expiration: string
    image: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    thumb: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    medium: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    delete_url: string
  }
  success: boolean
  status: number
}

export interface ImgBBUploadOptions {
  name?: string
  expiration?: number // in seconds
}

class ImgBBService {
  private apiKey: string
  private baseUrl = 'https://api.imgbb.com/1/upload'

  constructor() {
    // Use environment variable or fall back to default key
    this.apiKey = import.meta.env.VITE_IMGBB_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('ImgBB API key not configured. Image uploads will fail.')
    }
  }

  /**
   * Upload an image or video file to ImgBB
   * @param file - The file to upload (can be File or base64 string)
   * @param options - Upload options
   * @returns Promise with upload response
   */
  async uploadFile(
    file: File | string,
    options: ImgBBUploadOptions = {}
  ): Promise<ImgBBUploadResponse> {
    if (!this.apiKey) {
      throw new Error('ImgBB API key is not configured')
    }

    const formData = new FormData()
    formData.append('key', this.apiKey)

    if (typeof file === 'string') {
      // Assume it's a base64 string
      formData.append('image', file)
    } else {
      // Convert file to base64
      const base64 = await this.fileToBase64(file)
      formData.append('image', base64)
    }

    if (options.name) {
      formData.append('name', options.name)
    }

    if (options.expiration) {
      formData.append('expiration', options.expiration.toString())
    }

    try {
      const response = await fetch(this.apiKey, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`ImgBB upload failed: ${response.statusText}`)
      }

      const result: ImgBBUploadResponse = await response.json()

      if (!result.success) {
        throw new Error('ImgBB upload failed')
      }

      return result
    } catch (error) {
      console.error('Error uploading to ImgBB:', error)
      throw error
    }
  }

  /**
   * Convert a File to base64 string
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix (e.g., "data:image/png;base64,")
          const base64 = reader.result.split(',')[1]
          resolve(base64)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(
    files: (File | string)[],
    options: ImgBBUploadOptions = {}
  ): Promise<ImgBBUploadResponse[]> {
    const uploads = files.map((file) => this.uploadFile(file, options))
    return Promise.all(uploads)
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Set or update the API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }
}

// Export singleton instance
export const imgBBService = new ImgBBService()
