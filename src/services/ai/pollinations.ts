/**
 * Pollinations.AI Image and Video Generation Service
 * Handles AI-powered image and video generation
 */

export interface ImageGenerationOptions {
  model?: 'flux' | 'turbo' | 'gptimage' | 'kontext' | 'seedream' | 'nanobanana' | 'nanobanana-pro'
  width?: number
  height?: number
  seed?: number
  enhance?: boolean
  negative_prompt?: string
  nologo?: boolean
  safe?: boolean
  quality?: 'low' | 'medium' | 'high' | 'hd'
  transparent?: boolean
  guidance_scale?: number
}

export interface VideoGenerationOptions {
  model?: 'veo' | 'seedance' | 'seedance-pro'
  duration?: number // 4, 6, or 8 for veo; 2-10 for seedance
  aspectRatio?: '16:9' | '9:16'
  audio?: boolean // veo only
  referenceImage?: string // URL or base64
}

export interface TextGenerationOptions {
  model?: string // 'openai', 'gemini', 'claude', etc.
  temperature?: number
  stream?: boolean
  system?: string
  seed?: number
}

class PollinationsService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    // Use environment variable or empty string
    this.apiKey = import.meta.env.VITE_POLLINATIONS_API_KEY || ''
    this.baseUrl = 'https://gen.pollinations.ai'
  }

  /**
   * Generate an image from a text prompt
   */
  async generateImage(
    prompt: string,
    options: ImageGenerationOptions = {}
  ): Promise<Blob> {
    const params = new URLSearchParams()
    
    if (options.model) params.append('model', options.model)
    if (options.width) params.append('width', options.width.toString())
    if (options.height) params.append('height', options.height.toString())
    if (options.seed) params.append('seed', options.seed.toString())
    if (options.enhance) params.append('enhance', 'true')
    if (options.negative_prompt) params.append('negative_prompt', options.negative_prompt)
    if (options.nologo) params.append('nologo', 'true')
    if (options.safe) params.append('safe', 'true')
    if (options.quality) params.append('quality', options.quality)
    if (options.transparent) params.append('transparent', 'true')
    if (options.guidance_scale) params.append('guidance_scale', options.guidance_scale.toString())

    const url = `${this.baseUrl}/image/${encodeURIComponent(prompt)}?${params.toString()}`

    const headers: HeadersInit = {}
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url, { headers })

      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.statusText}`)
      }

      return await response.blob()
    } catch (error) {
      console.error('Error generating image:', error)
      throw error
    }
  }

  /**
   * Generate a video from a text prompt
   */
  async generateVideo(
    prompt: string,
    options: VideoGenerationOptions = {}
  ): Promise<Blob> {
    const params = new URLSearchParams()
    
    if (options.model) params.append('model', options.model)
    if (options.duration) params.append('duration', options.duration.toString())
    if (options.aspectRatio) params.append('aspectRatio', options.aspectRatio)
    if (options.audio) params.append('audio', 'true')
    if (options.referenceImage) params.append('image', options.referenceImage)

    const url = `${this.baseUrl}/image/${encodeURIComponent(prompt)}?${params.toString()}`

    const headers: HeadersInit = {}
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url, { headers })

      if (!response.ok) {
        throw new Error(`Video generation failed: ${response.statusText}`)
      }

      return await response.blob()
    } catch (error) {
      console.error('Error generating video:', error)
      throw error
    }
  }

  /**
   * Generate text using chat completion endpoint
   */
  async generateText(
    messages: Array<{ role: string; content: string }>,
    options: TextGenerationOptions = {}
  ): Promise<string> {
    const url = `${this.baseUrl}/v1/chat/completions`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const body = {
      model: options.model || 'openai',
      messages,
      temperature: options.temperature,
      stream: options.stream || false,
      ...(options.system && { system: options.system }),
      ...(options.seed && { seed: options.seed }),
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Text generation failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || ''
    } catch (error) {
      console.error('Error generating text:', error)
      throw error
    }
  }

  /**
   * Get available models for text generation
   */
  async getTextModels(): Promise<any[]> {
    const url = `${this.baseUrl}/v1/models`

    const headers: HeadersInit = {}
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching text models:', error)
      throw error
    }
  }

  /**
   * Get available models for image generation
   */
  async getImageModels(): Promise<any[]> {
    const url = `${this.baseUrl}/image/models`

    const headers: HeadersInit = {}
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(url, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image models: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching image models:', error)
      throw error
    }
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

  /**
   * Set or update the base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl
  }
}

// Export singleton instance
export const pollinationsService = new PollinationsService()
