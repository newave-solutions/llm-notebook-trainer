/**
 * @file CreativitySlider.tsx
 * @description User-friendly creativity/temperature control
 * @module components/molecules
 *
 * Abstracts the technical "temperature" parameter into user-friendly
 * presets with visual representations. No raw numbers shown to users.
 *
 * Presets:
 * - Precise (🎯): 0.3 - Deterministic, focused responses
 * - Balanced (⚖️): 0.7 - Mix of precision and creativity
 * - Creative (✨): 1.2 - Imaginative, varied responses
 *
 * @example
 * <CreativitySlider
 *   value={temperature}
 *   onChange={setTemperature}
 * />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '../atoms/Slider';

interface CreativitySliderProps {
  value: number;
  onChange: (value: number) => void;
  showDescription?: boolean;
}

const CREATIVITY_PRESETS = [
  {
    value: 0.3,
    label: 'Precise',
    icon: '🎯',
    description: 'Focused and deterministic responses',
  },
  {
    value: 0.7,
    label: 'Balanced',
    icon: '⚖️',
    description: 'Mix of precision and creativity',
  },
  {
    value: 1.2,
    label: 'Creative',
    icon: '✨',
    description: 'Imaginative and varied responses',
  },
];

/**
 * Creativity slider with user-friendly presets
 *
 * @param {CreativitySliderProps} props - Component props
 * @returns {JSX.Element} Slider with creativity presets
 */
export default function CreativitySlider({
  value,
  onChange,
  showDescription = true,
}: CreativitySliderProps) {
  // Find current preset based on value
  const currentPreset = CREATIVITY_PRESETS.reduce((closest, preset) => {
    const currentDiff = Math.abs(preset.value - value);
    const closestDiff = Math.abs(closest.value - value);
    return currentDiff < closestDiff ? preset : closest;
  }, CREATIVITY_PRESETS[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Creativity Level</Text>
      {showDescription && (
        <Text style={styles.helpText}>
          Control how focused or imaginative the AI's responses will be
        </Text>
      )}

      <Slider value={value} onChange={onChange} presets={CREATIVITY_PRESETS} />

      {showDescription && currentPreset && (
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionIcon}>{currentPreset.icon}</Text>
          <View style={styles.descriptionText}>
            <Text style={styles.descriptionTitle}>{currentPreset.label}</Text>
            <Text style={styles.descriptionBody}>{currentPreset.description}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  descriptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
  },
  descriptionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  descriptionText: {
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 4,
  },
  descriptionBody: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
});
