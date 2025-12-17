/**
 * Mock for @jan/extensions-web package when it's not available (desktop CICD builds)
 */

// Mock empty extensions registry
export const WEB_EXTENSIONS = {}

// Mock extension classes for completeness
export class AssistantExtensionWeb {
  constructor() {}
}

export class ConversationalExtensionWeb {
  constructor() {}
}

// Export registry type for TypeScript compatibility
export type WebExtensionRegistry = Record<string, never>

// Export WebExtensionName type
export type WebExtensionName = string

// Auth-related types
export type User = {
  id: string
  email?: string
  name?: string
  [key: string]: any
}

export type ProviderType = 'github' | 'google' | string

// Mock JanAuthService class
export class JanAuthService {
  getAllProviders(): Array<{ id: string; name: string; icon: string }> {
    // Return empty array in mock - authentication not available
    return []
  }

  async loginWithProvider(_providerId: ProviderType): Promise<void> {
    console.warn('Authentication not available in web standalone mode')
    throw new Error('Authentication not available in web standalone mode')
  }

  async handleProviderCallback(
    _providerId: ProviderType,
    _code: string,
    _state?: string
  ): Promise<void> {
    console.warn('Authentication not available in web standalone mode')
    throw new Error('Authentication not available in web standalone mode')
  }

  isAuthenticatedWithProvider(_providerId: ProviderType): boolean {
    return false
  }

  async logout(): Promise<void> {
    console.warn('Authentication not available in web standalone mode')
  }

  async getCurrentUser(_forceRefresh: boolean = false): Promise<User | null> {
    return null
  }

  isAuthenticated(): boolean {
    return false
  }

  onAuthEvent(_callback: (event: MessageEvent) => void): () => void {
    // Return no-op cleanup function
    return () => {}
  }
}

// Shared auth service singleton
let sharedAuthService: JanAuthService | null = null

export function getSharedAuthService(): JanAuthService {
  if (!sharedAuthService) {
    sharedAuthService = new JanAuthService()
  }
  return sharedAuthService
}

// Default export
export default {}
