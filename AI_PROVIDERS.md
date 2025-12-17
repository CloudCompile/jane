# Custom AI Providers Integration

This document describes the new AI provider integration features added to the Jane application, including support for custom AI providers with default configurations, image generation, video generation, and reference media uploads.

## Overview

The application now supports:
- **Pollinations.AI provider** for chat, image, and video generation
- **Default API keys** configured via environment variables
- **ImgBB integration** for reference image/video uploads
- **Multiple AI capabilities** including text, image, and video generation

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Pollinations.AI API Key
# Used as default for AI model provider (chat, image, video generation)
VITE_POLLINATIONS_API_KEY=sk_wV8ESNksRQWtYjykYkJ96mPl6GkOpjQ0

# ImgBB API Key  
# Used for reference video/image uploads
VITE_IMGBB_API_KEY=e82829283492d3b08c9c2ad556ce7a37
```

> ⚠️ **Note**: The `.env` file is gitignored. Use `.env.example` as a template for your local development.

## Features

### 1. Pollinations.AI Provider

A new provider has been added with support for multiple AI models and capabilities:

#### Chat Models
- **OpenAI (Pollinations)** - General-purpose chat model
- **OpenAI Fast (Pollinations)** - Fast chat for quick responses
- **Gemini (Pollinations)** - Google Gemini with search capabilities
- **Claude (Pollinations)** - Anthropic Claude model

#### Image Generation Models
- **Flux** - High-quality image generation
- **Turbo** - Fast image generation
- **Seedream** - Creative image generation with artistic style

#### Video Generation Models
- **Veo** - Text-to-video (4-8 seconds)
- **Seedance** - Text-to-video and image-to-video (2-10 seconds)

### 2. Default API Key Support

Users can:
- Use the default API key provided in the environment variables
- Override with their own API key in the settings
- See a notice when a default key is available

When viewing the Pollinations provider settings, users will see:
> ℹ️ Default API key is configured. Leave empty to use the default key for testing.

### 3. Image and Video Generation

The new services provide easy-to-use APIs for:

```typescript
import { pollinationsService } from '@/services/ai/pollinations'

// Generate an image
const imageBlob = await pollinationsService.generateImage(
  'a beautiful sunset over mountains',
  {
    model: 'flux',
    width: 1024,
    height: 1024,
    quality: 'high'
  }
)

// Generate a video
const videoBlob = await pollinationsService.generateVideo(
  'a cat playing with a ball',
  {
    model: 'seedance',
    duration: 5,
    aspectRatio: '16:9'
  }
)
```

### 4. Reference Media Uploads

For image-to-video generation, reference images/videos can be uploaded to ImgBB:

```typescript
import { imgBBService } from '@/services/uploads/imgbb'

// Upload a reference image
const uploadResult = await imgBBService.uploadFile(file, {
  name: 'my-reference',
  expiration: 3600 // 1 hour
})

// Use the URL for video generation
const videoBlob = await pollinationsService.generateVideo(
  'make this image move',
  {
    model: 'seedance',
    referenceImage: uploadResult.data.url
  }
)
```

### 5. React Hook Integration

A custom hook simplifies AI generation in components:

```typescript
import { useAIGeneration } from '@/hooks/useAIGeneration'

function MyComponent() {
  const { 
    generateImage, 
    generateVideo, 
    uploadFile,
    isGenerating,
    error 
  } = useAIGeneration()

  const handleGenerateImage = async () => {
    const result = await generateImage('a scenic landscape')
    if (result.url) {
      // Display image using result.url
    }
  }

  return (
    <button onClick={handleGenerateImage} disabled={isGenerating}>
      {isGenerating ? 'Generating...' : 'Generate Image'}
    </button>
  )
}
```

## API Services

### PollinationsService

Located at `src/services/ai/pollinations.ts`

**Methods:**
- `generateImage(prompt, options)` - Generate images
- `generateVideo(prompt, options)` - Generate videos
- `generateText(messages, options)` - Generate text/chat
- `getTextModels()` - List available text models
- `getImageModels()` - List available image models
- `setApiKey(key)` - Update API key
- `setBaseUrl(url)` - Update base URL

### ImgBBService

Located at `src/services/uploads/imgbb.ts`

**Methods:**
- `uploadFile(file, options)` - Upload a file
- `uploadMultiple(files, options)` - Upload multiple files
- `setApiKey(key)` - Update API key
- `isConfigured()` - Check if API key is set

## Model Capabilities

New model capabilities have been added:

```typescript
export enum ModelCapabilities {
  COMPLETION = 'completion',
  TOOLS = 'tools',
  EMBEDDINGS = 'embeddings',
  IMAGE_GENERATION = 'image_generation',
  VIDEO_GENERATION = 'video_generation',  // NEW
  AUDIO_GENERATION = 'audio_generation',
  TEXT_TO_IMAGE = 'text_to_image',
  IMAGE_TO_IMAGE = 'image_to_image',
  TEXT_TO_VIDEO = 'text_to_video',        // NEW
  IMAGE_TO_VIDEO = 'image_to_video',      // NEW
  TEXT_TO_AUDIO = 'text_to_audio',
  AUDIO_TO_TEXT = 'audio_to_text',
  VISION = 'vision',
}
```

## Configuration

### Adding Custom Providers

To add a custom AI provider, update `src/consts/providers.ts`:

```typescript
{
  active: true,
  api_key: '',
  base_url: 'https://your-api-endpoint.com',
  provider: 'your-provider',
  settings: [
    {
      key: 'api-key',
      title: 'API Key',
      description: 'Your API key description',
      controller_type: 'input',
      controller_props: {
        placeholder: 'Insert API Key',
        value: '',
        type: 'password',
        input_actions: ['unobscure', 'copy'],
      },
    },
    // ... more settings
  ],
  models: [
    {
      id: 'model-id',
      name: 'Model Name',
      version: '1.0',
      description: 'Model description',
      capabilities: ['completion', 'image_generation'],
    },
    // ... more models
  ],
}
```

### Environment Variable Access

To access environment variables in your code:

```typescript
// In service files
const apiKey = import.meta.env.VITE_YOUR_API_KEY

// In React components
import { useAPIConfig } from '@/hooks/useAPIConfig'

function MyComponent() {
  const { pollinations, imgbb } = useAPIConfig()
  
  console.log('Pollinations configured:', pollinations.isConfigured)
  console.log('ImgBB configured:', imgbb.isConfigured)
}
```

## Security Considerations

1. **Never commit `.env` file** - It's gitignored for security
2. **Use environment variables** - API keys should never be hardcoded
3. **Default keys** - The provided keys are for testing only
4. **Production keys** - Users should use their own API keys in production
5. **Key rotation** - Regularly rotate API keys for security

## Testing

To test the new features:

1. **Start the development server:**
   ```bash
   yarn dev
   ```

2. **Navigate to Settings → Model Providers**

3. **Select Pollinations provider**

4. **Configure or use default API key**

5. **Select a model** and test generation capabilities

## API Reference

### Pollinations.AI API

Based on `APIDOCSFORDEFAULT.json`, the Pollinations.AI API provides:

- **Base URL**: `https://gen.pollinations.ai`
- **Text Generation**: `/v1/chat/completions` (OpenAI-compatible)
- **Image Generation**: `/image/{prompt}`
- **Models List**: `/v1/models` and `/image/models`

### ImgBB API

- **Base URL**: `https://api.imgbb.com/1`
- **Upload**: `/upload`
- **Supports**: Images and videos
- **Max expiration**: Configurable (in seconds)

## Troubleshooting

### API Key Issues

**Problem**: "ImgBB API key not configured" error
**Solution**: Ensure `VITE_IMGBB_API_KEY` is set in `.env` file

**Problem**: "Pollinations API key not configured" warning
**Solution**: Either set `VITE_POLLINATIONS_API_KEY` or configure in settings UI

### Generation Failures

**Problem**: Image/video generation fails
**Solution**: 
- Check API key validity
- Verify network connection
- Check browser console for detailed errors
- Try with a simpler prompt

### Upload Issues

**Problem**: File upload to ImgBB fails
**Solution**:
- Check file size (max 32MB for free tier)
- Verify file format is supported
- Check API key permissions

## Future Enhancements

Potential improvements:
- [ ] UI for image/video generation
- [ ] Gallery view for generated media
- [ ] Batch generation support
- [ ] Progress indicators for long generations
- [ ] History of generated content
- [ ] Export/download capabilities
- [ ] Advanced prompt engineering tools

## Support

For issues or questions:
- Check the browser console for error messages
- Review the API documentation in `APIDOCSFORDEFAULT.json`
- Visit [Pollinations.AI](https://pollinations.ai) for provider-specific help
- Visit [ImgBB API docs](https://api.imgbb.com/) for upload issues
