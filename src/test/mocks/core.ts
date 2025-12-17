/**
 * Mock for @janhq/core package
 * This provides minimal type definitions and stub implementations
 * for the core package when building standalone
 */

// Enums
export enum ExtensionTypeEnum {
  Conversational = 'conversational',
  Assistant = 'assistant',
  Model = 'model',
  Inference = 'inference',
  SystemMonitoring = 'systemMonitoring',
  RAG = 'rag',
  MCP = 'mcp',
}

export enum ContentType {
  Text = 'text',
  Image = 'image',
  Audio = 'audio',
  Video = 'video',
  File = 'file',
}

export enum DownloadState {
  Downloading = 'downloading',
  Downloaded = 'downloaded',
  Error = 'error',
  Cancelled = 'cancelled',
}

export enum MessageStatus {
  Pending = 'pending',
  Sending = 'sending',
  Sent = 'sent',
  Error = 'error',
  Received = 'received',
  Read = 'read',
}

export enum ChatCompletionRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
  Tool = 'tool',
}

// Types
export type ModelInfo = {
  id: string
  name?: string
  description?: string
  version?: string
  capabilities?: string[]
  settings?: Record<string, any>
}

export type ThreadMessage = {
  id: string
  thread_id: string
  role: 'user' | 'assistant' | 'system'
  content: Array<{
    type: ContentType
    text?: { value: string; annotations?: any[] }
    image_file?: { file_id: string }
    [key: string]: any
  }>
  status?: string
  created_at?: number
  metadata?: Record<string, any>
  tool_calls?: any[]
}

export type Model = {
  id: string
  name: string
  engine?: string
  version?: string
  settings?: Record<string, any>
  parameters?: Record<string, any>
  metadata?: Record<string, any>
}

export type Assistant = {
  id: string
  name: string
  instructions?: string
  model?: string
  metadata?: Record<string, any>
}

export type AppConfiguration = {
  [key: string]: any
}

export type SessionInfo = {
  id: string
  model_id: string
  [key: string]: any
}

export type UnloadResult = {
  success: boolean
  message?: string
}

export type MCPTool = {
  name: string
  description?: string
  inputSchema?: Record<string, any>
  [key: string]: any
}

export type MCPToolCallResult = {
  tool: string
  result: any
  error?: string
}

export type MCPToolComponentProps = {
  [key: string]: any
}

export type IngestAttachmentsResult = {
  success: boolean
  message?: string
  [key: string]: any
}

export type SettingComponentProps = {
  [key: string]: any
}

// DownloadEvent should be an enum with event names
export enum DownloadEvent {
  onFileDownloadUpdate = 'onFileDownloadUpdate',
  onFileDownloadError = 'onFileDownloadError',
  onFileDownloadSuccess = 'onFileDownloadSuccess',
  onFileDownloadStopped = 'onFileDownloadStopped',
  onModelValidationStarted = 'onModelValidationStarted',
  onModelValidationFailed = 'onModelValidationFailed',
  onFileDownloadAndVerificationSuccess = 'onFileDownloadAndVerificationSuccess',
}

// AppEvent should be an enum or object with event names
export enum AppEvent {
  onAppUpdateAvailable = 'onAppUpdateAvailable',
  onAppUpdateDownloadUpdate = 'onAppUpdateDownloadUpdate',
  onAppUpdateDownloadSuccess = 'onAppUpdateDownloadSuccess',
  onAppUpdateDownloadError = 'onAppUpdateDownloadError',
  onAppUpdateDownloadCancelled = 'onAppUpdateDownloadCancelled',
  onModelImported = 'onModelImported',
}

// Interfaces
export interface BaseExtension {
  name: string
  type: ExtensionTypeEnum
  install?: () => Promise<void>
  uninstall?: () => Promise<void>
}

export interface ConversationalExtension extends BaseExtension {
  type: ExtensionTypeEnum.Conversational
  sendMessage?: (message: any) => Promise<any>
}

export interface AssistantExtension extends BaseExtension {
  type: ExtensionTypeEnum.Assistant
  getAssistants?: () => Promise<Assistant[]>
}

export interface RAGExtension extends BaseExtension {
  type: ExtensionTypeEnum.RAG
  ingestAttachments?: (attachments: any[]) => Promise<IngestAttachmentsResult>
}

export interface MCPExtension extends BaseExtension {
  type: ExtensionTypeEnum.MCP
  getTools?: () => Promise<MCPTool[]>
  callTool?: (tool: string, params: any) => Promise<MCPToolCallResult>
}

export interface VectorDBExtension extends BaseExtension {
  type: ExtensionTypeEnum
  search?: (query: string) => Promise<any[]>
}

export interface AIEngine {
  name: string
  load?: (model: Model) => Promise<void>
  unload?: (model: Model) => Promise<UnloadResult>
  inference?: (params: any) => Promise<any>
}

// Classes
export class EngineManager {
  private static _instance: EngineManager
  engines: Map<string, AIEngine> = new Map()
  
  static instance() {
    if (!EngineManager._instance) {
      EngineManager._instance = new EngineManager()
    }
    return EngineManager._instance
  }

  get(engineId: string): AIEngine | undefined {
    return this.engines.get(engineId)
  }

  register(engine: AIEngine) {
    // Mock implementation
  }
}

export class ModelManager {
  static instance: ModelManager
  
  static getInstance() {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager()
    }
    return ModelManager.instance
  }

  getModels(): Model[] {
    return []
  }

  getModel(modelId: string): Model | undefined {
    return undefined
  }

  registerModel(model: Model) {
    // Mock implementation
  }
}

// Constants
export const CoreRoutes = [
  'loadModel',
  'unloadModel',
  'getLoadedModel',
  'getModels',
  'stopServer',
  'startServer',
  'updateModel',
  'downloadModel',
  'cancelModelDownload',
  'deleteModel',
]

export const APIRoutes = [
  'listModels',
  'retrieveModel',
  'deleteModel',
  'createChatCompletion',
  'listThreads',
  'retrieveThread',
  'createThread',
  'updateThread',
  'deleteThread',
  'listMessages',
  'retrieveMessage',
  'createMessage',
  'updateMessage',
  'deleteMessage',
]

// EventEmitter class for events
class EventEmitter {
  private handlers: Map<string, Function[]>

  constructor() {
    this.handlers = new Map<string, Function[]>()
  }

  public on(eventName: string, handler: Function): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, [])
    }
    this.handlers.get(eventName)?.push(handler)
  }

  public off(eventName: string, handler: Function): void {
    if (!this.handlers.has(eventName)) {
      return
    }
    const handlers = this.handlers.get(eventName)
    const index = handlers?.indexOf(handler)
    if (index !== undefined && index !== -1) {
      handlers?.splice(index, 1)
    }
  }

  public emit(eventName: string, args: any): void {
    if (!this.handlers.has(eventName)) {
      return
    }
    const handlers = this.handlers.get(eventName)
    handlers?.forEach((handler) => {
      handler(args)
    })
  }
}

// Events - Create an EventEmitter instance instead of a plain object
export const events = new EventEmitter()

// Mock functions
export const modelInfo = (model: any): ModelInfo => {
  return {
    id: model?.id || 'unknown',
    name: model?.name,
    description: model?.description,
    version: model?.version,
    capabilities: model?.capabilities || [],
    settings: model?.settings || {},
  }
}

export const chatCompletionChunk = (data: any) => {
  return data
}

export const chatCompletionRequestMessage = (message: any) => {
  return message
}

// File system and path functions
export const fs = {
  readFile: async (path: string) => '',
  writeFile: async (path: string, content: string) => {},
  exists: async (path: string) => false,
  mkdir: async (path: string) => {},
  rmdir: async (path: string) => {},
  unlink: async (path: string) => {},
  readdir: async (path: string) => [],
}

export const getJanDataFolderPath = async () => {
  return '/mock/jan/data/folder'
}

export const joinPath = async (...paths: string[]) => {
  return paths.join('/')
}

// Default export
export default {
  ExtensionTypeEnum,
  ContentType,
  DownloadState,
  MessageStatus,
  ChatCompletionRole,
  DownloadEvent,
  AppEvent,
  EngineManager,
  ModelManager,
  CoreRoutes,
  APIRoutes,
  events,
  modelInfo,
  chatCompletionChunk,
  chatCompletionRequestMessage,
  fs,
  getJanDataFolderPath,
  joinPath,
}
