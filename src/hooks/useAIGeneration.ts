import { useState, useCallback } from 'react'
import { pollinationsService } from '@/services/ai/pollinations'
import { imgBBService } from '@/services/uploads/imgbb'
import type {
  ImageGenerationOptions,
  VideoGenerationOptions,
  TextGenerationOptions,
} from '@/services/ai/pollinations'
import { useAPIConfig } from './useAPIConfig'

export interface GenerationResult {
  url?: string
  blob?: Blob
  error?: string
}

/**
 * Hook for AI generation capabilities (text, image, video)
 * Provides easy access to generation services
 */
export const useAIGeneration = () => {
  const apiConfig = useAPIConfig()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Generate text using Pollinations.AI
   */
  const generateText = useCallback(
    async (
      messages: Array<{ role: string; content: string }>,
      options: TextGenerationOptions = {}
    ): Promise<string> => {
      setIsGenerating(true)
      setError(null)

      try {
        const result = await pollinationsService.generateText(messages, options)
        return result
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to generate text'
        setError(errorMessage)
        throw err
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  /**
   * Generate an image using Pollinations.AI
   */
  const generateImage = useCallback(
    async (
      prompt: string,
      options: ImageGenerationOptions = {}
    ): Promise<GenerationResult> => {
      setIsGenerating(true)
      setError(null)

      try {
        const blob = await pollinationsService.generateImage(prompt, options)
        const url = URL.createObjectURL(blob)
        return { blob, url }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to generate image'
        setError(errorMessage)
        return { error: errorMessage }
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  /**
   * Generate a video using Pollinations.AI
   */
  const generateVideo = useCallback(
    async (
      prompt: string,
      options: VideoGenerationOptions = {}
    ): Promise<GenerationResult> => {
      setIsGenerating(true)
      setError(null)

      try {
        const blob = await pollinationsService.generateVideo(prompt, options)
        const url = URL.createObjectURL(blob)
        return { blob, url }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to generate video'
        setError(errorMessage)
        return { error: errorMessage }
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  /**
   * Upload a file to ImgBB
   */
  const uploadFile = useCallback(
    async (
      file: File | string,
      options?: { name?: string; expiration?: number }
    ) => {
      setIsGenerating(true)
      setError(null)

      try {
        const result = await imgBBService.uploadFile(file, options)
        return result.data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to upload file'
        setError(errorMessage)
        throw err
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  /**
   * Generate video with reference image
   * Uploads reference image to ImgBB first, then uses URL for video generation
   */
  const generateVideoWithReference = useCallback(
    async (
      prompt: string,
      referenceFile: File,
      options: Omit<VideoGenerationOptions, 'referenceImage'> = {}
    ): Promise<GenerationResult> => {
      setIsGenerating(true)
      setError(null)

      try {
        // Upload reference image first
        const uploadResult = await imgBBService.uploadFile(referenceFile, {
          name: 'video-reference',
        })

        // Generate video with reference URL
        const videoOptions: VideoGenerationOptions = {
          ...options,
          referenceImage: uploadResult.data.url,
        }

        const blob = await pollinationsService.generateVideo(
          prompt,
          videoOptions
        )
        const url = URL.createObjectURL(blob)
        return { blob, url }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to generate video with reference'
        setError(errorMessage)
        return { error: errorMessage }
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  return {
    generateText,
    generateImage,
    generateVideo,
    uploadFile,
    generateVideoWithReference,
    isGenerating,
    error,
    apiConfig,
  }
}
