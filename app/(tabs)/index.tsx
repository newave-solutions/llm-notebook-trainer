import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import FeatureCard from '../components/FeatureCard';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: 'https://d64gsuwffb70l.cloudfront.net/6918560b0751a5ff71d01d43_1763203419041_2cdc3f62.webp' }}
        style={styles.hero}
      />
      <View style={styles.heroContent}>
        <Text style={styles.title}>Train AI Models{'\n'}Without Writing Code</Text>
        <Text style={styles.subtitle}>
          Upload your data, define your goal, and let AI handle the rest. No technical expertise required.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/create')}>
          <Text style={styles.ctaText}>Start Training</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.workflow}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.steps}>
          {[
            { title: 'Upload Data', desc: 'Drop your CSV, JSON, or TXT files' },
            { title: 'Define Goal', desc: 'Describe what you want in plain English' },
            { title: 'Train & Deploy', desc: 'AI handles the prompting and training' },
          ].map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featureGrid}>
          <FeatureCard icon="cube-outline" title="8+ AI Models" description="Choose from GPT-4, Claude, Llama, and more" />
          <FeatureCard icon="code-slash-outline" title="No Coding" description="Simple form-based interface for everyone" />
          <FeatureCard icon="flash-outline" title="Real-Time Training" description="Monitor progress with live metrics" />
          <FeatureCard icon="analytics-outline" title="Quality Scores" description="Evaluate outputs with AI-powered scoring" />
        </View>
      </View>


      <TouchableOpacity style={styles.secondaryCta} onPress={() => router.push('/models')}>
        <Text style={styles.secondaryCtaText}>Browse Models</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  hero: { width: '100%', height: 250, resizeMode: 'cover' },
  heroContent: { padding: 24, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: '#FFF', textAlign: 'center', lineHeight: 40 },
  subtitle: { fontSize: 16, color: '#D1D5DB', textAlign: 'center', marginTop: 16, lineHeight: 24 },
  ctaButton: { backgroundColor: '#8B5CF6', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, marginTop: 24 },
  ctaText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  workflow: { padding: 24 },
  sectionTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 24 },
  steps: { gap: 16 },
  step: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  stepNumber: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  stepNumberText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  stepTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 8 },
  stepDesc: { fontSize: 14, color: '#D1D5DB', lineHeight: 20 },
  secondaryCta: { margin: 24, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#8B5CF6', alignItems: 'center' },
  secondaryCtaText: { color: '#8B5CF6', fontSize: 16, fontWeight: '700' },
  features: { padding: 24, backgroundColor: 'rgba(139,92,246,0.05)' },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
});