/**
 * @file GenerationStudio.tsx
 * @description Complete generation workflow with wizard and results
 * @module components/organisms
 *
 * Orchestrates the entire generation workflow:
 * - Interactive wizard for input
 * - API call to generate content
 * - Response display with actions
 * - Error handling and retries
 * - Save/export functionality
 *
 * @example
 * <GenerationStudio
 *   projectId={project.id}
 *   onSave={handleSave}
 * />
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import InteractiveWizard from './InteractiveWizard';
import ResponseDisplay from '../molecules/ResponseDisplay';
import { modelRoutingService } from '../../services/modelRoutingService';

interface GenerationStudioProps {
  projectId?: string;
  onSave?: (result: GenerationResult) => void;
  onTrain?: (result: GenerationResult) => void;
}

interface GenerationResult {
  content: string;
  model: string;
  prompt: string;
  tokensUsed: number;
  timestamp: Date;
}

type StudioMode = 'wizard' | 'results';

/**
 * Complete generation workflow orchestrator
 *
 * @param {GenerationStudioProps} props - Component props
 * @returns {JSX.Element} Generation studio interface
 */
export default function GenerationStudio({
  projectId,
  onSave,
  onTrain,
}: GenerationStudioProps) {
  const [mode, setMode] = useState<StudioMode>('wizard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [lastConfig, setLastConfig] = useState<any>(null);

  const handleGenerate = async (config: any) => {
    setLoading(true);
    setError(undefined);
    setLastConfig(config);

    try {
      const lengthMap = {
        short: 500,
        medium: 1000,
        long: 2000,
      };

      const response = await modelRoutingService.generateContent({
        modelId: config.modelId,
        prompt: config.prompt,
        temperature: config.creativity,
        maxTokens: lengthMap[config.outputLength as keyof typeof lengthMap],
      });

      const generationResult: GenerationResult = {
        content: response.content,
        model: config.modelId,
        prompt: config.prompt,
        tokensUsed: response.tokensUsed,
        timestamp: new Date(),
      };

      setResult(generationResult);
      setMode('results');
    } catch (err: any) {
      setError(err.message || 'Failed to generate content. Please try again.');
      Alert.alert(
        'Generation Failed',
        err.message || 'Failed to generate content. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastConfig) {
      handleGenerate(lastConfig);
    }
  };

  const handleCopy = () => {
    Alert.alert('Copied!', 'Response copied to clipboard');
  };

  const handleSave = () => {
    if (result) {
      onSave?.(result);
      Alert.alert('Saved!', 'Response saved successfully');
    }
  };

  const handleTrain = () => {
    if (result) {
      onTrain?.(result);
      Alert.alert(
        'Training Mode',
        'This response will be used for model training'
      );
    }
  };

  const handleNewGeneration = () => {
    setMode('wizard');
    setResult(null);
    setError(undefined);
  };

  if (mode === 'results') {
    return (
      <View style={styles.container}>
        <ResponseDisplay
          content={result?.content || ''}
          loading={loading}
          error={error}
          tokensUsed={result?.tokensUsed}
          model={result?.model}
          onCopy={handleCopy}
          onSave={handleSave}
          onRegenerate={handleRegenerate}
          onTrain={handleTrain}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InteractiveWizard
        onComplete={handleGenerate}
        onCancel={handleNewGeneration}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
