
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SettingsPanelProps {
  temperature: number;
  maxTokens: number;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
}

export default function SettingsPanel({
  temperature,
  maxTokens,
  onTemperatureChange,
  onMaxTokensChange,
}: SettingsPanelProps) {
  const tempOptions = [0.3, 0.5, 0.7, 1.0, 1.5, 2.0];
  const tokenOptions = [500, 1000, 2000, 3000, 4000];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Settings</Text>

      <View style={styles.setting}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingLabel}>Temperature</Text>
          <Text style={styles.settingValue}>{temperature.toFixed(1)}</Text>
        </View>
        <View style={styles.options}>
          {tempOptions.map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.option, temperature === val && styles.optionActive]}
              onPress={() => onTemperatureChange(val)}
            >
              <Text style={[styles.optionText, temperature === val && styles.optionTextActive]}>
                {val.toFixed(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.hint}>Controls randomness (lower = focused, higher = creative)</Text>
      </View>

      <View style={styles.setting}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingLabel}>Max Tokens</Text>
          <Text style={styles.settingValue}>{maxTokens}</Text>
        </View>
        <View style={styles.options}>
          {tokenOptions.map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.option, maxTokens === val && styles.optionActive]}
              onPress={() => onMaxTokensChange(val)}
            >
              <Text style={[styles.optionText, maxTokens === val && styles.optionTextActive]}>
                {val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.hint}>Maximum length of generated response</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 20, marginVertical: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  title: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 20 },
  setting: { marginBottom: 20 },
  settingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  settingLabel: { fontSize: 14, color: '#D1D5DB', fontWeight: '600' },
  settingValue: { fontSize: 16, color: '#8B5CF6', fontWeight: '700' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  option: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  optionActive: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  optionText: { color: '#D1D5DB', fontSize: 14, fontWeight: '600' },
  optionTextActive: { color: '#FFF' },
  hint: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
});