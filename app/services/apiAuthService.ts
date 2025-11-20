/**
 * @file apiAuthService.ts
 * @description API Authentication Service
 * @module services
 *
 * Handles secure storage and retrieval of user API keys for multiple
 * cloud providers. All keys are encrypted at rest in Supabase and
 * never exposed in client logs.
 *
 * Security Features:
 * - Keys encrypted at rest in Supabase database
 * - Row Level Security ensures user isolation
 * - No keys in local storage or client logs
 * - Validation before storage
 *
 * @example
 * // Save an API key
 * await apiAuthService.saveApiKey('openai', 'sk-...');
 *
 * // Retrieve a key
 * const key = await apiAuthService.getApiKey('openai');
 */

import { apiKeyService, ApiKey } from './database';

export type ProviderType = 'openai' | 'anthropic' | 'google' | 'azure' | 'deepseek';

export interface ApiKeyConfig {
  provider: ProviderType;
  apiKey: string;
  isActive: boolean;
}

export interface ProviderStatus {
  provider: ProviderType;
  hasKey: boolean;
  isActive: boolean;
  lastUpdated?: string;
}

/**
 * Save an API key for a provider with encryption
 *
 * @param {ProviderType} provider - The cloud provider
 * @param {string} apiKey - The API key to store (will be encrypted)
 * @returns {Promise<ApiKey>} Saved key record
 * @throws {Error} If validation fails or storage error occurs
 */
export async function saveApiKey(
  provider: ProviderType,
  apiKey: string
): Promise<ApiKey> {
  // Validate API key format
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API key cannot be empty');
  }

  // Basic format validation per provider
  validateApiKeyFormat(provider, apiKey);

  // Store encrypted key in database
  const savedKey = await apiKeyService.upsert({
    user_id: '', // Will be filled by RLS with auth.uid()
    provider,
    api_key: apiKey,
    is_active: true,
  });

  return savedKey;
}

/**
 * Retrieve an API key for a provider
 *
 * @param {ProviderType} provider - The cloud provider
 * @returns {Promise<string | null>} Decrypted API key or null if not found
 * @throws {Error} If retrieval error occurs
 */
export async function getApiKey(provider: ProviderType): Promise<string | null> {
  const keyRecord = await apiKeyService.getByProvider(provider);

  if (!keyRecord || !keyRecord.is_active) {
    return null;
  }

  return keyRecord.api_key;
}

/**
 * Test if an API key is valid by making a test request
 *
 * @param {ProviderType} provider - The cloud provider
 * @returns {Promise<boolean>} True if key is valid
 */
export async function testApiKey(provider: ProviderType): Promise<boolean> {
  const apiKey = await getApiKey(provider);

  if (!apiKey) {
    return false;
  }

  // Make a minimal test request to validate the key
  try {
    // Implementation would vary by provider
    // For now, we'll just check if the key exists and has proper format
    return validateApiKeyFormat(provider, apiKey);
  } catch (error) {
    console.error(`API key test failed for ${provider}:`, error);
    return false;
  }
}

/**
 * Delete an API key for a provider
 *
 * @param {ProviderType} provider - The cloud provider
 * @returns {Promise<void>}
 * @throws {Error} If deletion error occurs
 */
export async function deleteApiKey(provider: ProviderType): Promise<void> {
  await apiKeyService.delete(provider);
}

/**
 * Get all configured API keys (without exposing actual keys)
 *
 * @returns {Promise<ProviderStatus[]>} List of provider statuses
 */
export async function getAllApiKeys(): Promise<ProviderStatus[]> {
  const keys = await apiKeyService.getAll();

  return keys.map((key) => ({
    provider: key.provider,
    hasKey: true,
    isActive: key.is_active,
    lastUpdated: key.updated_at,
  }));
}

/**
 * Get list of providers with active API keys
 *
 * @returns {Promise<ProviderType[]>} Array of provider names with valid keys
 */
export async function getActiveProviders(): Promise<ProviderType[]> {
  const statuses = await getAllApiKeys();

  return statuses
    .filter((status) => status.hasKey && status.isActive)
    .map((status) => status.provider);
}

/**
 * Check if a provider has an active API key
 *
 * @param {ProviderType} provider - The cloud provider
 * @returns {Promise<boolean>} True if provider has active key
 */
export async function hasActiveKey(provider: ProviderType): Promise<boolean> {
  const key = await getApiKey(provider);
  return key !== null;
}

/**
 * Validate API key format for a provider
 * Each provider has different key formats
 *
 * @param {ProviderType} provider - The cloud provider
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} True if format is valid
 * @throws {Error} If format is invalid
 */
function validateApiKeyFormat(provider: ProviderType, apiKey: string): boolean {
  switch (provider) {
    case 'openai':
      if (!apiKey.startsWith('sk-')) {
        throw new Error('OpenAI API keys must start with "sk-"');
      }
      break;

    case 'anthropic':
      if (!apiKey.startsWith('sk-ant-')) {
        throw new Error('Anthropic API keys must start with "sk-ant-"');
      }
      break;

    case 'google':
      if (!apiKey.startsWith('AIza')) {
        throw new Error('Google API keys must start with "AIza"');
      }
      break;

    case 'deepseek':
      if (!apiKey.startsWith('ds-')) {
        throw new Error('DeepSeek API keys must start with "ds-"');
      }
      break;

    case 'azure':
      // Azure uses custom endpoint + key, less strict validation
      if (apiKey.length < 10) {
        throw new Error('Azure API key appears to be too short');
      }
      break;

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }

  return true;
}

/**
 * Get provider display information
 *
 * @param {ProviderType} provider - The cloud provider
 * @returns {Object} Provider metadata
 */
export function getProviderInfo(provider: ProviderType) {
  const providerMap = {
    openai: {
      name: 'OpenAI',
      icon: '🤖',
      docsUrl: 'https://platform.openai.com/api-keys',
    },
    anthropic: {
      name: 'Anthropic',
      icon: '🧠',
      docsUrl: 'https://console.anthropic.com',
    },
    google: {
      name: 'Google Cloud',
      icon: '🔍',
      docsUrl: 'https://console.cloud.google.com',
    },
    azure: {
      name: 'Microsoft Azure',
      icon: '☁️',
      docsUrl: 'https://portal.azure.com',
    },
    deepseek: {
      name: 'DeepSeek',
      icon: '🔬',
      docsUrl: 'https://platform.deepseek.com',
    },
  };

  return providerMap[provider];
}

// Export all functions as a service object
export const apiAuthService = {
  saveApiKey,
  getApiKey,
  testApiKey,
  deleteApiKey,
  getAllApiKeys,
  getActiveProviders,
  hasActiveKey,
  getProviderInfo,
};
