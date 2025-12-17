// Export everything from core.ts
export * from '../core'

// Explicitly re-export types for Rollup compatibility
export type {
  ModelInfo,
  ThreadMessage,
  Model,
  Assistant,
  AppConfiguration,
  SessionInfo,
  UnloadResult,
  MCPTool,
  MCPToolCallResult,
  MCPToolComponentProps,
  IngestAttachmentsResult,
  SettingComponentProps,
  BaseExtension,
  ConversationalExtension,
  AssistantExtension,
  RAGExtension,
  MCPExtension,
  VectorDBExtension,
  AIEngine,
} from '../core'
