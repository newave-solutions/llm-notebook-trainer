import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ResultCardProps {
  input: string;
  output: string;
  qualityScore?: number;
}

export default function ResultCard({ input, output, qualityScore }: ResultCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.section}>
        <Text style={styles.label}>Input:</Text>
        <Text style={styles.text}>{input}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.label}>Output:</Text>
        <Text style={styles.text}>{output}</Text>
      </View>

      {qualityScore !== undefined && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Quality Score:</Text>
          <Text style={styles.scoreValue}>{qualityScore}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  section: { marginBottom: 12 },
  label: { fontSize: 12, color: '#A78BFA', fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  text: { fontSize: 14, color: '#D1D5DB', lineHeight: 20 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 12 },
  scoreContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  scoreLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  scoreValue: { fontSize: 18, color: '#10B981', fontWeight: '700' },
});