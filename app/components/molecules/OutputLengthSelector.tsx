/**
 * @file OutputLengthSelector.tsx
 * @description User-friendly output length selector
 * @module components/molecules
 *
 * Transforms technical "max tokens" into intuitive length options
 * with visual representations and descriptions.
 *
 * Options:
 * - Brief: ~1 paragraph (256 tokens)
 * - Standard: ~2-3 paragraphs (512 tokens)
 * - Detailed: Full page (1024 tokens)
 * - Extended: Multiple pages (2048 tokens)
 *
 * @example
 * <OutputLengthSelector
 *   value={maxTokens}
 *   onChange={setMaxTokens}
 * />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface OutputLengthOption {
  label: string;
  value: number;
  description: string;
  icon: string;
  bars: number; // Visual representation (1-4 bars)
}

interface OutputLengthSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const LENGTH_OPTIONS: OutputLengthOption[] = [
  {
    label: 'Brief',
    value: 256,
    description: '~1 paragraph',
    icon: '📝',
    bars: 1,
  },
  {
    label: 'Standard',
    value: 512,
    description: '~2-3 paragraphs',
    icon: '📄',
    bars: 2,
  },
  {
    label: 'Detailed',
    value: 1024,
    description: 'Full page',
    icon: '📑',
    bars: 3,
  },
  {
    label: 'Extended',
    value: 2048,
    description: 'Multiple pages',
    icon: '📚',
    bars: 4,
  },
];

/**
 * Output length selector with visual cards
 *
 * @param {OutputLengthSelectorProps} props - Component props
 * @returns {JSX.Element} Interactive length selector
 */
export default function OutputLengthSelector({
  value,
  onChange,
}: OutputLengthSelectorProps) {
  // Find closest option to current value
  const selectedOption = LENGTH_OPTIONS.reduce((closest, option) => {
    const currentDiff = Math.abs(option.value - value);
    const closestDiff = Math.abs(closest.value - value);
    return currentDiff < closestDiff ? option : closest;
  }, LENGTH_OPTIONS[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Response Length</Text>
      <Text style={styles.helpText}>
        Choose how much detail you want in the response
      </Text>

      <View style={styles.optionsGrid}>
        {LENGTH_OPTIONS.map((option) => {
          const isSelected = option.value === selectedOption.value;

          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => onChange(option.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>

              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>

              <Text style={styles.optionDescription}>{option.description}</Text>

              {/* Visual bars representation */}
              <View style={styles.barsContainer}>
                {[...Array(4)].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.bar,
                      index < option.bars && styles.barActive,
                      isSelected && index < option.bars && styles.barSelected,
                    ]}
                  />
                ))}
              </View>

              {isSelected && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderColor: '#3B82F6',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#3B82F6',
  },
  optionDescription: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  barsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  bar: {
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  barActive: {
    backgroundColor: '#94A3B8',
  },
  barSelected: {
    backgroundColor: '#3B82F6',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
