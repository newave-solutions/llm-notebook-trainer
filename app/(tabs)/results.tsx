

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import ResultCard from '../components/ResultCard';

export default function ResultsScreen() {
  const sampleResults = [
    {
      input: 'Write a product description for wireless headphones',
      output: 'Experience premium sound quality with our wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals.',
      qualityScore: 92,
    },
    {
      input: 'Summarize this customer feedback',
      output: 'Customer is satisfied with product quality but experienced delayed shipping. Recommends improving delivery times.',
      qualityScore: 88,
    },
    {
      input: 'Generate a creative tagline for eco-friendly products',
      output: 'Green Today, Thriving Tomorrow - Sustainable Choices for a Better World',
      qualityScore: 95,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Results</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Samples</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>91.7%</Text>
          <Text style={styles.statLabel}>Avg Quality</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>1.2K</Text>
          <Text style={styles.statLabel}>Tokens</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll}>
        {sampleResults.map((result, index) => (
          <ResultCard key={index} {...result} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  exportButton: { backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  exportText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  stats: { flexDirection: 'row', padding: 24, gap: 16 },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#8B5CF6', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#9CA3AF', textTransform: 'uppercase' },
  scroll: { flex: 1, padding: 24 },
});