

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import SettingsPanel from '../components/SettingsPanel';

export default function SettingsScreen() {
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Configure your AI model parameters</Text>

      <SettingsPanel
        temperature={temperature}
        maxTokens={maxTokens}
        onTemperatureChange={setTemperature}
        onMaxTokensChange={setMaxTokens}
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Model Parameters</Text>
        <Text style={styles.infoText}>
          Temperature controls the randomness of responses. Lower values (0-0.5) make outputs more focused and deterministic, while higher values (1-2) increase creativity and variety.
        </Text>
        <Text style={styles.infoText}>
          Max Tokens limits the length of generated responses. One token is roughly 4 characters or 0.75 words.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#D1D5DB', marginBottom: 24 },
  infoCard: { backgroundColor: 'rgba(139,92,246,0.1)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#8B5CF6' },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 12 },
  infoText: { fontSize: 14, color: '#D1D5DB', lineHeight: 20, marginBottom: 8 },
});