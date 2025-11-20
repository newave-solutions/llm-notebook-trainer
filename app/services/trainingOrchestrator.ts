/**
 * @file trainingOrchestrator.ts
 * @description Training Orchestrator Service
 * @module services
 *
 * Manages end-to-end training workflows including conversation
 * collection, quality scoring, and dataset aggregation.
 *
 * Training Workflow:
 * 1. Create training session for a project
 * 2. Collect prompt-response pairs through conversation
 * 3. User provides quality feedback (1-5 stars)
 * 4. Aggregate into training dataset
 * 5. Export in provider-specific format
 * 6. (Optional) Trigger fine-tuning job
 *
 * @example
 * const session = await trainingOrchestrator.createSession(projectId, 'gpt-4');
 * await trainingOrchestrator.addTrainingPair(session.id, {
 *   prompt: 'Explain AI',
 *   response: 'AI is...',
 *   qualityScore: 5
 * });
 */

import { supabase } from '../lib/supabase';
import { trainingService, TrainingSession, TrainingResult } from './database';

export interface TrainingPair {
  prompt: string;
  response: string;
  qualityScore: number; // 1-5 stars
  userFeedback?: string;
  tokensUsed?: number;
  metadata?: Record<string, any>;
}

export interface TrainingSessionConfig {
  projectId: string;
  modelId: string;
  targetProvider?: string;
  minQualityScore?: number;
}

export interface ExportOptions {
  format: 'openai' | 'anthropic' | 'generic' | 'csv';
  minQuality?: number;
  includeMetadata?: boolean;
}

export interface SessionStats {
  totalPairs: number;
  averageQuality: number;
  totalTokens: number;
  highQualityPairs: number;
  readyForTraining: boolean;
}

/**
 * Create a new training session
 *
 * @param {TrainingSessionConfig} config - Session configuration
 * @returns {Promise<TrainingSession>} Created session
 */
export async function createSession(
  config: TrainingSessionConfig
): Promise<TrainingSession> {
  const session = await trainingService.createSession({
    project_id: config.projectId,
    status: 'pending',
    progress: 0,
    tokens_used: 0,
    estimated_cost: 0,
  });

  return session;
}

/**
 * Add a training pair to a session
 *
 * @param {string} sessionId - The training session ID
 * @param {TrainingPair} pair - The prompt-response pair with quality score
 * @returns {Promise<TrainingResult>} Created training result
 */
export async function addTrainingPair(
  sessionId: string,
  pair: TrainingPair
): Promise<TrainingResult> {
  // Validate quality score
  if (pair.qualityScore < 1 || pair.qualityScore > 5) {
    throw new Error('Quality score must be between 1 and 5');
  }

  // Store the training pair
  const result = await trainingService.createResult({
    session_id: sessionId,
    input_text: pair.prompt,
    output_text: pair.response,
    quality_score: pair.qualityScore,
    tokens_used: pair.tokensUsed || 0,
  });

  // Update session tokens
  if (pair.tokensUsed) {
    const session = await trainingService.getSessionsByProject(''); // Would need session lookup
    // Update session with new token count
  }

  return result;
}

/**
 * Update quality score for an existing pair
 *
 * @param {string} resultId - The training result ID
 * @param {number} newScore - New quality score (1-5)
 * @returns {Promise<void>}
 */
export async function updateQualityScore(
  resultId: string,
  newScore: number
): Promise<void> {
  if (newScore < 1 || newScore > 5) {
    throw new Error('Quality score must be between 1 and 5');
  }

  // Update via direct Supabase call since we don't have updateResult in service
  await supabase
    .from('training_results')
    .update({ quality_score: newScore })
    .eq('id', resultId);
}

/**
 * Get all pairs for a training session
 *
 * @param {string} sessionId - The training session ID
 * @returns {Promise<TrainingResult[]>} All training pairs
 */
export async function getSessionPairs(
  sessionId: string
): Promise<TrainingResult[]> {
  return await trainingService.getResults(sessionId);
}

/**
 * Get session statistics
 *
 * @param {string} sessionId - The training session ID
 * @returns {Promise<SessionStats>} Session statistics
 */
export async function getSessionStats(sessionId: string): Promise<SessionStats> {
  const pairs = await getSessionPairs(sessionId);

  const totalPairs = pairs.length;
  const averageQuality =
    totalPairs > 0
      ? pairs.reduce((sum, p) => sum + (p.quality_score || 0), 0) / totalPairs
      : 0;

  const totalTokens = pairs.reduce((sum, p) => sum + (p.tokens_used || 0), 0);
  const highQualityPairs = pairs.filter((p) => (p.quality_score || 0) >= 4).length;

  // Ready for training if we have at least 10 high-quality pairs
  const readyForTraining = highQualityPairs >= 10;

  return {
    totalPairs,
    averageQuality,
    totalTokens,
    highQualityPairs,
    readyForTraining,
  };
}

/**
 * Export training data in specified format
 *
 * @param {string} sessionId - The training session ID
 * @param {ExportOptions} options - Export configuration
 * @returns {Promise<string>} Formatted training data
 */
export async function exportTrainingData(
  sessionId: string,
  options: ExportOptions
): Promise<string> {
  const pairs = await getSessionPairs(sessionId);

  // Filter by quality if specified
  const filtered = options.minQuality
    ? pairs.filter((p) => (p.quality_score || 0) >= options.minQuality!)
    : pairs;

  switch (options.format) {
    case 'openai':
      return exportOpenAIFormat(filtered);

    case 'anthropic':
      return exportAnthropicFormat(filtered);

    case 'csv':
      return exportCSVFormat(filtered);

    case 'generic':
    default:
      return exportGenericFormat(filtered);
  }
}

/**
 * Export in OpenAI JSONL format
 */
function exportOpenAIFormat(pairs: TrainingResult[]): string {
  const jsonl = pairs
    .map((pair) => {
      return JSON.stringify({
        messages: [
          { role: 'user', content: pair.input_text },
          { role: 'assistant', content: pair.output_text },
        ],
      });
    })
    .join('\n');

  return jsonl;
}

/**
 * Export in Anthropic format
 */
function exportAnthropicFormat(pairs: TrainingResult[]): string {
  const examples = pairs.map((pair) => ({
    input: pair.input_text,
    output: pair.output_text,
    quality: pair.quality_score,
  }));

  return JSON.stringify(examples, null, 2);
}

/**
 * Export in CSV format
 */
function exportCSVFormat(pairs: TrainingResult[]): string {
  let csv = 'prompt,response,quality_score,tokens_used\n';

  pairs.forEach((pair) => {
    const prompt = pair.input_text.replace(/"/g, '""');
    const response = pair.output_text.replace(/"/g, '""');
    csv += `"${prompt}","${response}",${pair.quality_score || 0},${pair.tokens_used || 0}\n`;
  });

  return csv;
}

/**
 * Export in generic JSON format
 */
function exportGenericFormat(pairs: TrainingResult[]): string {
  const data = pairs.map((pair) => ({
    prompt: pair.input_text,
    response: pair.output_text,
    qualityScore: pair.quality_score,
    tokensUsed: pair.tokens_used,
    createdAt: pair.created_at,
  }));

  return JSON.stringify(data, null, 2);
}

/**
 * Delete a training pair
 *
 * @param {string} resultId - The training result ID
 * @returns {Promise<void>}
 */
export async function deleteTrainingPair(resultId: string): Promise<void> {
  await supabase.from('training_results').delete().eq('id', resultId);
}

/**
 * Clear all pairs from a session
 *
 * @param {string} sessionId - The training session ID
 * @returns {Promise<void>}
 */
export async function clearSession(sessionId: string): Promise<void> {
  await supabase.from('training_results').delete().eq('session_id', sessionId);
}

/**
 * Mark session as ready for training
 *
 * @param {string} sessionId - The training session ID
 * @returns {Promise<void>}
 */
export async function markSessionReady(sessionId: string): Promise<void> {
  await trainingService.updateSession(sessionId, {
    status: 'ready',
  });
}

/**
 * Get recommended minimum pairs for provider
 *
 * @param {string} provider - Provider name
 * @returns {number} Recommended minimum training pairs
 */
export function getRecommendedMinimumPairs(provider: string): number {
  const recommendations: Record<string, number> = {
    openai: 10,
    anthropic: 20,
    google: 15,
    deepseek: 10,
    azure: 10,
  };

  return recommendations[provider] || 10;
}

/**
 * Validate training pair quality
 *
 * @param {TrainingPair} pair - Pair to validate
 * @returns {Object} Validation result with suggestions
 */
export function validateTrainingPair(pair: TrainingPair): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check prompt length
  if (pair.prompt.length < 10) {
    issues.push('Prompt is too short');
    suggestions.push('Provide more context in the prompt (at least 10 characters)');
  }

  if (pair.prompt.length > 10000) {
    issues.push('Prompt is too long');
    suggestions.push('Consider breaking down into smaller prompts');
  }

  // Check response length
  if (pair.response.length < 10) {
    issues.push('Response is too short');
    suggestions.push('Responses should be substantive (at least 10 characters)');
  }

  // Check quality score
  if (pair.qualityScore < 3) {
    suggestions.push('Consider only including pairs with quality score >= 3');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

// Export as service object
export const trainingOrchestrator = {
  createSession,
  addTrainingPair,
  updateQualityScore,
  getSessionPairs,
  getSessionStats,
  exportTrainingData,
  deleteTrainingPair,
  clearSession,
  markSessionReady,
  getRecommendedMinimumPairs,
  validateTrainingPair,
};
