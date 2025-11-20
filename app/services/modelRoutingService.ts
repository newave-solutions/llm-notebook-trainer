/**
 * @file modelRoutingService.ts
 * @description Model Routing Service
 * @module services
 *
 * Intelligently routes generation requests to the correct LLM provider
 * based on model selection. Handles request formatting, response
 * normalization, and error handling across multiple providers.
 *
 * Architecture:
 * - Provider detection from model ID
 * - User API key injection from secure storage
 * - Provider-specific request formatting
 * - Unified response interface
 * - Automatic retry logic
 * - Token usage and cost tracking
 *
 * @example
 * const response = await modelRoutingService.generateContent({
 *   modelId: 'gpt-4-turbo',
 *   prompt: 'Explain quantum computing',
 *   temperature: 0.7,
 *   maxTokens: 512,
 *   context: 'Additional training data context'
 * });
 */

import { supabase } from '../lib/supabase';
import { apiAuthService, ProviderType } from './apiAuthService';

export interface GenerationRequest {
  modelId: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
  context?: string;
  systemPrompt?: string;
}

export interface GenerationResponse {
  content: string;
  tokensUsed: number;
  model: string;
  provider: string;
  cost: number;
  finishReason?: string;
}

export interface StreamChunk {
  content: string;
  isComplete: boolean;
}

/**
 * Main generation endpoint - routes to correct provider
 *
 * @param {GenerationRequest} request - Generation parameters
 * @returns {Promise<GenerationResponse>} AI-generated content with metadata
 * @throws {Error} If provider key missing or generation fails
 */
export async function generateContent(
  request: GenerationRequest
): Promise<GenerationResponse> {
  // Detect provider from model ID
  const provider = getModelProvider(request.modelId);

  // Check if user has API key for this provider
  const hasKey = await apiAuthService.hasActiveKey(provider);
  if (!hasKey) {
    throw new Error(
      `No active API key found for ${provider}. Please add your key in Settings.`
    );
  }

  // Call the edge function with user's authenticated session
  // The edge function will retrieve the user's API key from the database
  const { data, error } = await supabase.functions.invoke('generate-content', {
    body: {
      prompt: buildFullPrompt(request),
      provider: provider,
      model: request.modelId,
      temperature: request.temperature,
      maxTokens: request.maxTokens,
    },
  });

  if (error) {
    throw new Error(`Generation failed: ${error.message}`);
  }

  if (!data || !data.success) {
    throw new Error(data?.error || 'Unknown error occurred');
  }

  // Calculate cost
  const cost = calculateCost(provider, data.tokensUsed);

  return {
    content: data.content,
    tokensUsed: data.tokensUsed,
    model: data.model,
    provider: data.provider,
    cost: cost,
    finishReason: data.finishReason,
  };
}

/**
 * Stream content generation (for real-time updates)
 *
 * @param {GenerationRequest} request - Generation parameters
 * @param {Function} onChunk - Callback for each content chunk
 * @returns {Promise<GenerationResponse>} Final response with full content
 */
export async function streamContent(
  request: GenerationRequest,
  onChunk: (chunk: StreamChunk) => void
): Promise<GenerationResponse> {
  // For now, fallback to regular generation
  // Streaming can be implemented with Server-Sent Events or WebSockets
  const response = await generateContent(request);

  // Simulate streaming effect for better UX
  const words = response.content.split(' ');
  let currentText = '';

  for (let i = 0; i < words.length; i++) {
    currentText += words[i] + ' ';
    onChunk({
      content: currentText,
      isComplete: i === words.length - 1,
    });

    // Small delay for streaming effect
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return response;
}

/**
 * Detect provider from model ID
 *
 * @param {string} modelId - The model identifier
 * @returns {ProviderType} Detected provider
 * @throws {Error} If model ID format is unrecognized
 */
export function getModelProvider(modelId: string): ProviderType {
  // ARCHITECTURE: Model IDs use predictable prefixes that identify
  // their provider. This allows automatic routing without maintaining
  // a large lookup table.

  if (modelId.startsWith('gpt-')) {
    return 'openai';
  }

  if (modelId.startsWith('claude-')) {
    return 'anthropic';
  }

  if (modelId.startsWith('gemini-') || modelId.startsWith('palm-')) {
    return 'google';
  }

  if (modelId.startsWith('deepseek-')) {
    return 'deepseek';
  }

  // Azure models can have custom names, check for azure in name
  if (modelId.includes('azure')) {
    return 'azure';
  }

  // Default fallback - try OpenAI
  console.warn(`Unknown model prefix for ${modelId}, defaulting to OpenAI`);
  return 'openai';
}

/**
 * Build the full prompt with context and system instructions
 *
 * @param {GenerationRequest} request - Generation parameters
 * @returns {string} Complete prompt with context
 */
function buildFullPrompt(request: GenerationRequest): string {
  let fullPrompt = '';

  // Add system prompt if provided
  if (request.systemPrompt) {
    fullPrompt += `System: ${request.systemPrompt}\n\n`;
  }

  // Add context if provided
  if (request.context) {
    fullPrompt += `Context:\n${request.context}\n\n`;
  }

  // Add main prompt
  fullPrompt += request.prompt;

  return fullPrompt;
}

/**
 * Calculate cost based on provider and token usage
 *
 * @param {ProviderType} provider - The cloud provider
 * @param {number} tokens - Number of tokens used
 * @returns {number} Estimated cost in USD
 */
export function calculateCost(provider: ProviderType, tokens: number): number {
  // Cost per 1K tokens (approximate, as of 2025)
  const costPer1K: Record<ProviderType, number> = {
    openai: 0.03, // GPT-4 pricing
    anthropic: 0.015, // Claude pricing
    google: 0.01, // Gemini pricing
    azure: 0.03, // Similar to OpenAI
    deepseek: 0.001, // Competitive pricing
  };

  const rate = costPer1K[provider] || 0.01;
  return (tokens / 1000) * rate;
}

/**
 * Get available models for a provider
 *
 * @param {ProviderType} provider - The cloud provider
 * @returns {string[]} Array of model IDs
 */
export function getProviderModels(provider: ProviderType): string[] {
  const modelMap: Record<ProviderType, string[]> = {
    openai: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    google: ['gemini-pro', 'gemini-ultra', 'palm-2'],
    azure: ['azure-gpt-4', 'azure-gpt-35-turbo'],
    deepseek: ['deepseek-coder', 'deepseek-chat'],
  };

  return modelMap[provider] || [];
}

/**
 * Validate generation request parameters
 *
 * @param {GenerationRequest} request - Request to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
export function validateRequest(request: GenerationRequest): boolean {
  if (!request.prompt || request.prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }

  if (request.prompt.length > 100000) {
    throw new Error('Prompt is too long (max 100,000 characters)');
  }

  if (request.temperature < 0 || request.temperature > 2) {
    throw new Error('Temperature must be between 0 and 2');
  }

  if (request.maxTokens < 1 || request.maxTokens > 4096) {
    throw new Error('Max tokens must be between 1 and 4096');
  }

  return true;
}

/**
 * Get model capabilities and metadata
 *
 * @param {string} modelId - The model identifier
 * @returns {Object} Model metadata
 */
export function getModelInfo(modelId: string) {
  const modelData: Record<string, any> = {
    'gpt-4-turbo': {
      name: 'GPT-4 Turbo',
      contextWindow: 128000,
      maxOutputTokens: 4096,
      supportsVision: true,
      supportsJson: true,
    },
    'claude-3-opus': {
      name: 'Claude 3 Opus',
      contextWindow: 200000,
      maxOutputTokens: 4096,
      supportsVision: true,
      supportsJson: true,
    },
    'deepseek-coder': {
      name: 'DeepSeek Coder',
      contextWindow: 16000,
      maxOutputTokens: 4096,
      supportsVision: false,
      supportsJson: true,
    },
  };

  return modelData[modelId] || {
    name: modelId,
    contextWindow: 8000,
    maxOutputTokens: 2048,
    supportsVision: false,
    supportsJson: false,
  };
}

// Export as service object
export const modelRoutingService = {
  generateContent,
  streamContent,
  getModelProvider,
  calculateCost,
  getProviderModels,
  validateRequest,
  getModelInfo,
};
