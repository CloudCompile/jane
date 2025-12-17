import { useMemo } from 'react'

/**
 * Hook to get API configuration with defaults
 * Provides default API keys from environment variables
 */
export const useAPIConfig = () => {
  const config = useMemo(() => {
    return {
      pollinations: {
        apiKey: import.meta.env.VITE_POLLINATIONS_API_KEY || '',
        baseUrl: 'https://gen.pollinations.ai',
        isConfigured: !!import.meta.env.VITE_POLLINATIONS_API_KEY,
      },
      imgbb: {
        apiKey: import.meta.env.VITE_IMGBB_API_KEY || '',
        baseUrl: 'https://api.imgbb.com/1',
        isConfigured: !!import.meta.env.VITE_IMGBB_API_KEY,
      },
    }
  }, [])

  return config
}

/**
 * Get default API key for a provider if available
 */
export const getDefaultAPIKey = (provider: string): string => {
  switch (provider.toLowerCase()) {
    case 'pollinations':
      return import.meta.env.VITE_POLLINATIONS_API_KEY || ''
    case 'imgbb':
      return import.meta.env.VITE_IMGBB_API_KEY || ''
    default:
      return ''
  }
}
