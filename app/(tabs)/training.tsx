

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ProgressBar from '../components/ProgressBar';
import { supabase } from '../lib/supabase';

export default function TrainingScreen() {
  const { projectId } = useLocalSearchParams();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('pending');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [samples, setSamples] = useState<string[]>([]);

  const startTraining = () => {
    setStatus('training');
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('completed');
          return 100;
        }
        return prev + 10;
      });
      setTokensUsed(prev => prev + Math.floor(Math.random() * 100));
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Training Dashboard</Text>
      <Text style={styles.subtitle}>Monitor your model training progress</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Training Status</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status.toUpperCase()}</Text>
        </View>
        <ProgressBar progress={progress} label="Overall Progress" />
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Tokens Used</Text>
            <Text style={styles.metricValue}>{tokensUsed.toLocaleString()}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Estimated Cost</Text>
            <Text style={styles.metricValue}>${(tokensUsed * 0.002 / 1000).toFixed(4)}</Text>
          </View>
        </View>
      </View>

      {status === 'pending' && (
        <TouchableOpacity style={styles.button} onPress={startTraining}>
          <Text style={styles.buttonText}>Start Training</Text>
        </TouchableOpacity>
      )}

      {status === 'completed' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Training Complete!</Text>
          <Text style={styles.successText}>Your model is ready to use</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#D1D5DB', marginBottom: 24 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 16 },
  statusBadge: { backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 16 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  metrics: { flexDirection: 'row', gap: 16, marginTop: 16 },
  metric: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12 },
  metricLabel: { fontSize: 12, color: '#A78BFA', marginBottom: 4 },
  metricValue: { fontSize: 24, fontWeight: '700', color: '#FFF' },
  button: { backgroundColor: '#8B5CF6', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  successText: { fontSize: 16, color: '#10B981', fontWeight: '600' },
});