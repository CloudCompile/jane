# Dynamic Provider Loading and Registry System

This document describes the new dynamic provider loading system that allows you to easily add and manage AI model providers in Lyra.

## Features

### 1. Built-in Provider Support

Lyra now comes with support for many popular AI providers out of the box:

- **OpenAI** - GPT models
- **Azure OpenAI** - Enterprise OpenAI deployment
- **Anthropic** - Claude models
- **Cohere** - Cohere language models
- **OpenRouter** - Access to multiple models
- **Mistral** - Mistral AI models
- **Groq** - Fast inference
- **Google Gemini** - Google's AI models
- **Hugging Face** - Open source models
- **Pollinations.AI** - Free AI with image/video generation
- **xAI (Grok)** - xAI's Grok models
- **Perplexity** - Online search-enabled models
- **Together AI** - Fast inference platform
- **DeepSeek** - DeepSeek reasoning models
- **Fireworks AI** - Fast model inference
- **Cloudflare Workers AI** - Edge AI inference
- **SambaNova** - High-performance AI

### 2. Dynamic Model Loading

Models are dynamically loaded from each provider's API endpoint:

- Automatic discovery of available models
- Caching to reduce API calls (5-minute cache)
- Retry logic for failed requests (3 attempts)
- Support for multiple response formats

### 3. Provider Registry System

Add custom providers programmatically or from configuration files:

```typescript
import { providerRegistry } from '@/lib/providerRegistry'

// Register a single provider
providerRegistry.registerProvider({
  provider: 'my-custom-provider',
  base_url: 'https://api.example.com/v1',
  settings: [...],
  models: [...]
})

// Load from a URL
await providerRegistry.loadProvidersFromUrl('https://example.com/providers.json')

// Load from a config object
providerRegistry.loadProvidersFromConfig({
  version: '1.0',
  providers: [...]
})
```

## Usage

### Using the React Hook

The `useProviderRegistry` hook makes it easy to work with the provider registry:

```typescript
import { useProviderRegistry } from '@/hooks/useProviderRegistry'

function MyComponent() {
  const {
    externalProviders,
    loading,
    error,
    registerProvider,
    loadFromUrl,
    unregisterProvider
  } = useProviderRegistry()

  const handleLoadProviders = async () => {
    await loadFromUrl('/providers.json')
  }

  return (
    <div>
      <button onClick={handleLoadProviders} disabled={loading}>
        Load Providers
      </button>
      {error && <p>Error: {error}</p>}
      <ul>
        {externalProviders.map(p => (
          <li key={p.provider}>{p.provider}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Dynamic Model Fetching

The `useProviderModels` hook fetches models dynamically from a provider:

```typescript
import { useProviderModels } from '@/hooks/useProviderModels'

function ModelSelector({ provider }: { provider: ModelProvider }) {
  const { models, loading, error, refetch } = useProviderModels(provider)

  if (loading) return <div>Loading models...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <button onClick={refetch}>Refresh Models</button>
      <ul>
        {models.map(model => (
          <li key={model}>{model}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Creating Custom Providers

### JSON Configuration Format

Create a JSON file with your provider configuration:

```json
{
  "version": "1.0",
  "providers": [
    {
      "provider": "my-provider",
      "active": true,
      "base_url": "https://api.myprovider.com/v1",
      "explore_models_url": "https://docs.myprovider.com/models",
      "settings": [
        {
          "key": "api-key",
          "title": "API Key",
          "description": "Your API key",
          "controller_type": "input",
          "controller_props": {
            "placeholder": "Insert API Key",
            "value": "",
            "type": "password",
            "input_actions": ["unobscure", "copy"]
          }
        },
        {
          "key": "base-url",
          "title": "Base URL",
          "description": "API endpoint",
          "controller_type": "input",
          "controller_props": {
            "placeholder": "https://api.myprovider.com/v1",
            "value": "https://api.myprovider.com/v1"
          }
        }
      ],
      "models": [
        {
          "id": "model-id",
          "name": "Model Name",
          "version": "1.0",
          "description": "Model description",
          "capabilities": ["completion", "tools"]
        }
      ],
      "custom_header": [
        {
          "header": "X-Custom-Header",
          "value": "custom-value"
        }
      ]
    }
  ]
}
```

### Setting Fields

Each provider setting supports these controller types:

- `input` - Text input field
- `checkbox` - Boolean checkbox
- `dropdown` - Select dropdown
- `slider` - Numeric slider

### Model Capabilities

Available capabilities:

- `completion` - Text completion/chat
- `tools` - Function/tool calling
- `embeddings` - Text embeddings
- `image_generation` - Image generation
- `video_generation` - Video generation
- `text_to_image` - Text to image
- `image_to_image` - Image to image
- `text_to_video` - Text to video
- `image_to_video` - Image to video
- `text_to_audio` - Text to speech
- `audio_to_text` - Speech to text
- `vision` - Vision/image understanding

## Advanced Features

### Custom Headers

Some providers require custom headers:

```typescript
{
  provider: 'anthropic',
  custom_header: [
    {
      header: 'anthropic-version',
      value: '2023-06-01'
    },
    {
      header: 'anthropic-dangerous-direct-browser-access',
      value: 'true'
    }
  ]
}
```

### Response Format Support

The dynamic model loader supports multiple API response formats:

1. OpenAI format: `{ data: [{ id: "model-id" }] }`
2. Direct array: `["model-1", "model-2"]`
3. Alternative format: `{ models: [...] }`
4. List object: `{ object: "list", data: [...] }`

### Retry Logic

Failed model fetches are automatically retried:

- Maximum 3 attempts
- Exponential backoff (1s, 2s, 3s)
- Only network errors are retried
- Authentication errors fail immediately

### Caching

Model lists are cached for 5 minutes to reduce API calls:

- Per-provider cache
- Cache invalidated on manual refresh
- Automatic cache expiration

## Best Practices

1. **Test Your Provider Configuration**
   - Validate JSON syntax before loading
   - Test with a small number of models first
   - Verify API endpoints are accessible

2. **Security**
   - Never commit API keys in configuration files
   - Use environment variables for sensitive data
   - Validate external configuration sources

3. **Performance**
   - Use caching to minimize API calls
   - Load providers on demand, not all at once
   - Consider lazy loading for large model lists

4. **Error Handling**
   - Always check for errors when loading providers
   - Provide user-friendly error messages
   - Log errors for debugging

## Examples

### Loading Providers from a File

```typescript
// In your component or initialization code
import { providerRegistry } from '@/lib/providerRegistry'

// Load from public directory
await providerRegistry.loadProvidersFromUrl('/my-providers.json')

// Load from remote URL
await providerRegistry.loadProvidersFromUrl('https://example.com/providers.json')
```

### Creating a Provider Programmatically

```typescript
import { providerRegistry } from '@/lib/providerRegistry'

providerRegistry.registerProvider({
  provider: 'my-llm-service',
  active: true,
  base_url: 'https://api.myllm.com/v1',
  settings: [
    {
      key: 'api-key',
      title: 'API Key',
      description: 'Your service API key',
      controller_type: 'input',
      controller_props: {
        placeholder: 'sk-...',
        value: '',
        type: 'password',
        input_actions: ['unobscure', 'copy']
      }
    }
  ],
  models: []  // Will be loaded dynamically
})
```

### Listening to Provider Changes

```typescript
import { providerRegistry } from '@/lib/providerRegistry'

const unsubscribe = providerRegistry.onProvidersChanged(() => {
  console.log('Providers updated:', providerRegistry.getRegisteredProviders())
})

// Later, cleanup
unsubscribe()
```

## Troubleshooting

### Models Not Loading

1. Check the base URL is correct
2. Verify API key is valid
3. Check browser console for errors
4. Try manual refresh with the refetch function

### CORS Errors

Some providers may have CORS restrictions:

1. Use a CORS proxy (not recommended for production)
2. Request the provider to allow your domain
3. Use server-side proxy

### Invalid Configuration

If a configuration fails to load:

1. Validate JSON syntax
2. Check all required fields are present
3. Verify field types match the schema
4. Review error messages in console

## API Reference

See `/public/providers-example.json` for a complete template with all available options.
