import { describe, it, expect, beforeEach, vi } from 'vitest'
import { providerRegistry, ProviderTemplate, ExternalProviderConfig } from '@/lib/providerRegistry'

describe('ProviderRegistry', () => {
  beforeEach(() => {
    providerRegistry.clearAll()
  })

  describe('registerProvider', () => {
    it('should register a single provider', () => {
      const provider: ProviderTemplate = {
        provider: 'test-provider',
        base_url: 'https://api.test.com',
        settings: [],
      }

      providerRegistry.registerProvider(provider)
      const registered = providerRegistry.getProvider('test-provider')

      expect(registered).toEqual(provider)
    })

    it('should notify listeners when a provider is registered', () => {
      const callback = vi.fn()
      providerRegistry.onProvidersChanged(callback)

      const provider: ProviderTemplate = {
        provider: 'test-provider',
        base_url: 'https://api.test.com',
        settings: [],
      }

      providerRegistry.registerProvider(provider)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('registerProviders', () => {
    it('should register multiple providers at once', () => {
      const providers: ProviderTemplate[] = [
        {
          provider: 'provider1',
          base_url: 'https://api.provider1.com',
          settings: [],
        },
        {
          provider: 'provider2',
          base_url: 'https://api.provider2.com',
          settings: [],
        },
      ]

      providerRegistry.registerProviders(providers)
      const registered = providerRegistry.getRegisteredProviders()

      expect(registered).toHaveLength(2)
      expect(registered).toEqual(expect.arrayContaining(providers))
    })

    it('should notify listeners once when multiple providers are registered', () => {
      const callback = vi.fn()
      providerRegistry.onProvidersChanged(callback)

      const providers: ProviderTemplate[] = [
        {
          provider: 'provider1',
          base_url: 'https://api.provider1.com',
          settings: [],
        },
        {
          provider: 'provider2',
          base_url: 'https://api.provider2.com',
          settings: [],
        },
      ]

      providerRegistry.registerProviders(providers)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('getProvider', () => {
    it('should return undefined for non-existent provider', () => {
      const provider = providerRegistry.getProvider('non-existent')
      expect(provider).toBeUndefined()
    })

    it('should return the correct provider when it exists', () => {
      const testProvider: ProviderTemplate = {
        provider: 'test-provider',
        base_url: 'https://api.test.com',
        settings: [],
      }

      providerRegistry.registerProvider(testProvider)
      const retrieved = providerRegistry.getProvider('test-provider')

      expect(retrieved).toEqual(testProvider)
    })
  })

  describe('hasProvider', () => {
    it('should return false for non-existent provider', () => {
      expect(providerRegistry.hasProvider('non-existent')).toBe(false)
    })

    it('should return true for registered provider', () => {
      providerRegistry.registerProvider({
        provider: 'test-provider',
        base_url: 'https://api.test.com',
        settings: [],
      })

      expect(providerRegistry.hasProvider('test-provider')).toBe(true)
    })
  })

  describe('unregisterProvider', () => {
    it('should remove a registered provider', () => {
      providerRegistry.registerProvider({
        provider: 'test-provider',
        base_url: 'https://api.test.com',
        settings: [],
      })

      expect(providerRegistry.hasProvider('test-provider')).toBe(true)

      providerRegistry.unregisterProvider('test-provider')
      expect(providerRegistry.hasProvider('test-provider')).toBe(false)
    })

    it('should notify listeners when a provider is unregistered', () => {
      const callback = vi.fn()
      providerRegistry.onProvidersChanged(callback)

      providerRegistry.registerProvider({
        provider: 'test-provider',
        base_url: 'https://api.test.com',
        settings: [],
      })

      callback.mockClear() // Clear the register call

      providerRegistry.unregisterProvider('test-provider')
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('clearAll', () => {
    it('should remove all registered providers', () => {
      providerRegistry.registerProviders([
        {
          provider: 'provider1',
          base_url: 'https://api.provider1.com',
          settings: [],
        },
        {
          provider: 'provider2',
          base_url: 'https://api.provider2.com',
          settings: [],
        },
      ])

      expect(providerRegistry.getRegisteredProviders()).toHaveLength(2)

      providerRegistry.clearAll()
      expect(providerRegistry.getRegisteredProviders()).toHaveLength(0)
    })

    it('should notify listeners when all providers are cleared', () => {
      const callback = vi.fn()
      providerRegistry.onProvidersChanged(callback)

      providerRegistry.registerProvider({
        provider: 'test-provider',
        base_url: 'https://api.test.com',
        settings: [],
      })

      callback.mockClear()

      providerRegistry.clearAll()
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('loadProvidersFromConfig', () => {
    it('should load providers from a valid config', () => {
      const config: ExternalProviderConfig = {
        version: '1.0',
        providers: [
          {
            provider: 'config-provider',
            base_url: 'https://api.config.com',
            settings: [],
          },
        ],
      }

      providerRegistry.loadProvidersFromConfig(config)
      expect(providerRegistry.hasProvider('config-provider')).toBe(true)
    })

    it('should throw error for invalid config', () => {
      const invalidConfig = {
        version: '1.0',
        // Missing providers array
      } as unknown as ExternalProviderConfig

      expect(() => {
        providerRegistry.loadProvidersFromConfig(invalidConfig)
      }).toThrow('Invalid provider configuration format')
    })

    it('should throw error for config with invalid provider structure', () => {
      const invalidConfig: ExternalProviderConfig = {
        version: '1.0',
        providers: [
          {
            provider: 'test',
            // Missing required base_url
            settings: [],
          } as ProviderTemplate,
        ],
      }

      expect(() => {
        providerRegistry.loadProvidersFromConfig(invalidConfig)
      }).toThrow('Invalid provider configuration format')
    })
  })

  describe('loadProvidersFromUrl', () => {
    beforeEach(() => {
      global.fetch = vi.fn()
    })

    it('should load providers from a URL', async () => {
      const config: ExternalProviderConfig = {
        version: '1.0',
        providers: [
          {
            provider: 'url-provider',
            base_url: 'https://api.url.com',
            settings: [],
          },
        ],
      }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => config,
      })

      await providerRegistry.loadProvidersFromUrl('https://example.com/providers.json')
      expect(providerRegistry.hasProvider('url-provider')).toBe(true)
    })

    it('should throw error when fetch fails', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      })

      await expect(
        providerRegistry.loadProvidersFromUrl('https://example.com/providers.json')
      ).rejects.toThrow()
    })

    it('should throw error for invalid JSON from URL', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ invalid: 'structure' }),
      })

      await expect(
        providerRegistry.loadProvidersFromUrl('https://example.com/providers.json')
      ).rejects.toThrow('Invalid provider configuration format')
    })
  })

  describe('onProvidersChanged', () => {
    it('should allow unsubscribing from changes', () => {
      const callback = vi.fn()
      const unsubscribe = providerRegistry.onProvidersChanged(callback)

      providerRegistry.registerProvider({
        provider: 'test-provider',
        base_url: 'https://api.test.com',
        settings: [],
      })

      expect(callback).toHaveBeenCalledTimes(1)

      unsubscribe()
      callback.mockClear()

      providerRegistry.registerProvider({
        provider: 'test-provider-2',
        base_url: 'https://api.test2.com',
        settings: [],
      })

      expect(callback).not.toHaveBeenCalled()
    })

    it('should handle errors in callbacks gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Callback error')
      })
      const successCallback = vi.fn()

      providerRegistry.onProvidersChanged(errorCallback)
      providerRegistry.onProvidersChanged(successCallback)

      // Should not throw even though errorCallback throws
      expect(() => {
        providerRegistry.registerProvider({
          provider: 'test-provider',
          base_url: 'https://api.test.com',
          settings: [],
        })
      }).not.toThrow()

      expect(errorCallback).toHaveBeenCalled()
      expect(successCallback).toHaveBeenCalled()
    })
  })

  describe('getRegisteredProviders', () => {
    it('should return an empty array when no providers are registered', () => {
      expect(providerRegistry.getRegisteredProviders()).toEqual([])
    })

    it('should return all registered providers', () => {
      const providers: ProviderTemplate[] = [
        {
          provider: 'provider1',
          base_url: 'https://api.provider1.com',
          settings: [],
        },
        {
          provider: 'provider2',
          base_url: 'https://api.provider2.com',
          settings: [],
        },
      ]

      providerRegistry.registerProviders(providers)
      const registered = providerRegistry.getRegisteredProviders()

      expect(registered).toHaveLength(2)
      expect(registered).toEqual(expect.arrayContaining(providers))
    })
  })
})
