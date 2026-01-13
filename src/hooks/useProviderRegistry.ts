import { useState, useEffect, useCallback } from 'react'
import { providerRegistry, ProviderTemplate, ExternalProviderConfig } from '@/lib/providerRegistry'
import { useModelProvider } from './useModelProvider'

export const useProviderRegistry = () => {
  const [externalProviders, setExternalProviders] = useState<ProviderTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setProviders, providers } = useModelProvider()

  // Update external providers when registry changes
  useEffect(() => {
    const updateProviders = () => {
      setExternalProviders(providerRegistry.getRegisteredProviders())
    }

    updateProviders()
    const unsubscribe = providerRegistry.onProvidersChanged(updateProviders)

    return () => {
      unsubscribe()
    }
  }, [])

  // Sync external providers with the model provider store
  useEffect(() => {
    if (externalProviders.length > 0) {
      // Merge external providers with existing providers
      const externalProviderNames = externalProviders.map(p => p.provider)
      const existingProviders = providers.filter(
        p => !externalProviderNames.includes(p.provider)
      )
      
      const mergedProviders = [
        ...existingProviders,
        ...externalProviders.map(p => ({
          ...p,
          models: p.models || [],
        } as ModelProvider))
      ]
      
      setProviders(mergedProviders)
    }
  }, [externalProviders, providers, setProviders])

  const registerProvider = useCallback((provider: ProviderTemplate) => {
    try {
      providerRegistry.registerProvider(provider)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register provider'
      setError(errorMessage)
      console.error('Error registering provider:', err)
    }
  }, [])

  const registerProviders = useCallback((providers: ProviderTemplate[]) => {
    try {
      providerRegistry.registerProviders(providers)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register providers'
      setError(errorMessage)
      console.error('Error registering providers:', err)
    }
  }, [])

  const loadFromUrl = useCallback(async (url: string) => {
    setLoading(true)
    setError(null)
    try {
      await providerRegistry.loadProvidersFromUrl(url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load providers from URL'
      setError(errorMessage)
      console.error('Error loading providers from URL:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadFromConfig = useCallback((config: ExternalProviderConfig) => {
    setError(null)
    try {
      providerRegistry.loadProvidersFromConfig(config)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load providers from config'
      setError(errorMessage)
      console.error('Error loading providers from config:', err)
    }
  }, [])

  const unregisterProvider = useCallback((providerName: string) => {
    try {
      providerRegistry.unregisterProvider(providerName)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unregister provider'
      setError(errorMessage)
      console.error('Error unregistering provider:', err)
    }
  }, [])

  const clearAll = useCallback(() => {
    try {
      providerRegistry.clearAll()
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear providers'
      setError(errorMessage)
      console.error('Error clearing providers:', err)
    }
  }, [])

  return {
    externalProviders,
    loading,
    error,
    registerProvider,
    registerProviders,
    loadFromUrl,
    loadFromConfig,
    unregisterProvider,
    clearAll,
  }
}
