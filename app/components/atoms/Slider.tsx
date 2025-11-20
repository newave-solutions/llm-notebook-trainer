/**
 * @file Slider.tsx
 * @description Custom slider component for parameter adjustment
 * @module components/atoms
 *
 * A user-friendly slider with preset markers and visual feedback.
 * Designed for creativity/temperature controls without showing raw numbers.
 *
 * @example
 * <Slider
 *   value={0.7}
 *   onChange={setValue}
 *   presets={[
 *     { value: 0.3, label: 'Precise' },
 *     { value: 0.7, label: 'Balanced' },
 *     { value: 1.2, label: 'Creative' }
 *   ]}
 * />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface SliderPreset {
  value: number;
  label: string;
  icon?: string;
}

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  presets?: SliderPreset[];
  label?: string;
  showValue?: boolean;
  style?: ViewStyle;
}

/**
 * Slider component with preset markers
 *
 * @param {SliderProps} props - Slider configuration
 * @returns {JSX.Element} Interactive slider with presets
 */
export default function Slider({
  value,
  onChange,
  presets,
  label,
  showValue = false,
  style,
}: SliderProps) {
  const handlePresetTap = (presetValue: number) => {
    onChange(presetValue);
  };

  // Find closest preset to current value
  const activePresetIndex = presets
    ? presets.reduce((closest, preset, index) => {
        const currentDiff = Math.abs(preset.value - value);
        const closestDiff = Math.abs(presets[closest].value - value);
        return currentDiff < closestDiff ? index : closest;
      }, 0)
    : -1;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.sliderContainer}>
        {presets &&
          presets.map((preset, index) => {
            const isActive = index === activePresetIndex;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.preset, isActive && styles.presetActive]}
                onPress={() => handlePresetTap(preset.value)}
              >
                {preset.icon && <Text style={styles.icon}>{preset.icon}</Text>}
                <Text
                  style={[styles.presetLabel, isActive && styles.presetLabelActive]}
                >
                  {preset.label}
                </Text>
                {isActive && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
      </View>

      {showValue && (
        <Text style={styles.valueDisplay}>{value.toFixed(1)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  preset: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  presetActive: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  presetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  presetLabelActive: {
    color: '#3B82F6',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 8,
  },
  valueDisplay: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
});
