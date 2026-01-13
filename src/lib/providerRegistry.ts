/**
 * Provider Registry - Dynamic provider loading and registration system
 * Allows adding providers at runtime from various sources
 */

export interface ProviderTemplate {
  provider: string
  active?: boolean
  api_key?: string
  base_url: string
  explore_models_url?: string
  settings: ProviderSetting[]
  models?: Model[]
  persist?: boolean
  custom_header?: ProviderCustomHeader[] | null
}

export interface ExternalProviderConfig {
  providers: ProviderTemplate[]
  version?: string
}

class ProviderRegistry {
  private static instance: ProviderRegistry
  private externalProviders: Map<string, ProviderTemplate> = new Map()
  private providerLoadCallbacks: Set<() => void> = new Set()

  private constructor() {}

  static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry()
    }
    return ProviderRegistry.instance
  }

  /**
   * Register a provider from a template
   */
  registerProvider(provider: ProviderTemplate): void {
    this.externalProviders.set(provider.provider, provider)
    this.notifyListeners()
  }

  /**
   * Register multiple providers at once
   */
  registerProviders(providers: ProviderTemplate[]): void {
    providers.forEach(provider => {
      this.externalProviders.set(provider.provider, provider)
    })
    this.notifyListeners()
  }

  /**
   * Load providers from a JSON URL
   */
  async loadProvidersFromUrl(url: string): Promise<void> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch providers from ${url}: ${response.statusText}`)
      }
      const config: ExternalProviderConfig = await response.json()
      
      if (!this.validateProviderConfig(config)) {
        throw new Error('Invalid provider configuration format')
      }

      this.registerProviders(config.providers)
    } catch (error) {
      console.error('Error loading providers from URL:', error)
      throw error
    }
  }

  /**
   * Load providers from a JSON object
   */
  loadProvidersFromConfig(config: ExternalProviderConfig): void {
    if (!this.validateProviderConfig(config)) {
      throw new Error('Invalid provider configuration format')
    }
    this.registerProviders(config.providers)
  }

  /**
   * Get all registered external providers
   */
  getRegisteredProviders(): ProviderTemplate[] {
    return Array.from(this.externalProviders.values())
  }

  /**
   * Get a specific provider by name
   */
  getProvider(providerName: string): ProviderTemplate | undefined {
    return this.externalProviders.get(providerName)
  }

  /**
   * Check if a provider is registered
   */
  hasProvider(providerName: string): boolean {
    return this.externalProviders.has(providerName)
  }

  /**
   * Unregister a provider
   */
  unregisterProvider(providerName: string): void {
    this.externalProviders.delete(providerName)
    this.notifyListeners()
  }

  /**
   * Clear all registered providers
   */
  clearAll(): void {
    this.externalProviders.clear()
    this.notifyListeners()
  }

  /**
   * Subscribe to provider changes
   */
  onProvidersChanged(callback: () => void): () => void {
    this.providerLoadCallbacks.add(callback)
    return () => {
      this.providerLoadCallbacks.delete(callback)
    }
  }

  /**
   * Validate provider configuration
   */
  private validateProviderConfig(config: ExternalProviderConfig): boolean {
    if (!config || !Array.isArray(config.providers)) {
      return false
    }

    return config.providers.every(provider => {
      return (
        typeof provider.provider === 'string' &&
        typeof provider.base_url === 'string' &&
        Array.isArray(provider.settings)
      )
    })
  }

  /**
   * Notify all listeners of provider changes
   */
  private notifyListeners(): void {
    this.providerLoadCallbacks.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Error in provider change callback:', error)
      }
    })
  }
}

export const providerRegistry = ProviderRegistry.getInstance()
