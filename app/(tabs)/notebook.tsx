/**
 * @file notebook.tsx
 * @description No-Code AI Generation Studio
 * @module screens
 *
 * Transformed from Jupyter-style notebook to guided wizard.
 * Users never see or interact with code - just intuitive controls.
 *
 * Features:
 * - Step-by-step wizard interface
 * - Visual model selection
 * - User-friendly parameter controls
 * - Training mode through conversation
 * - Export and save functionality
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import GenerationStudio from '../components/organisms/GenerationStudio';
import TrainingStudio from '../components/organisms/TrainingStudio';

type StudioMode = 'generate' | 'train';

export default function NotebookScreen() {
  const [mode, setMode] = useState<StudioMode>('generate');
  const [trainingSessionId] = useState(() => Date.now().toString());

  const handleSaveGeneration = (result: any) => {
    console.log('Save generation:', result);
  };

  const handleStartTraining = (result: any) => {
    setMode('train');
  };

  const handleTrainingComplete = (exportedData: string) => {
    console.log('Training complete:', exportedData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'generate' && styles.modeButtonActive]}
          onPress={() => setMode('generate')}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === 'generate' && styles.modeButtonTextActive,
            ]}
          >
            Generate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, mode === 'train' && styles.modeButtonActive]}
          onPress={() => setMode('train')}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === 'train' && styles.modeButtonTextActive,
            ]}
          >
            Train
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'generate' ? (
        <GenerationStudio
          onSave={handleSaveGeneration}
          onTrain={handleStartTraining}
        />
      ) : (
        <TrainingStudio
          sessionId={trainingSessionId}
          modelId="gpt-3.5-turbo"
          onComplete={handleTrainingComplete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  modeSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
  },
  modeButtonTextActive: {
    color: '#FFF',
  },
});