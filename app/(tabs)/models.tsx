import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ModelCard from '../components/ModelCard';
import { AI_MODELS } from '../constants/models';

export default function ModelsScreen() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredModels = filter === 'all'
    ? AI_MODELS
    : AI_MODELS.filter(m => m.provider.toLowerCase().includes(filter.toLowerCase()));

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleContinue = () => {
    if (selectedModel) {
      router.push({ pathname: '/create', params: { modelId: selectedModel } });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Choose Your AI Model</Text>
        <Text style={styles.subtitle}>Select the model that best fits your needs</Text>

        <View style={styles.filters}>
          {['all', 'OpenAI', 'Meta', 'Google'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onSelect={handleSelectModel}
            selected={selectedModel === model.id}
          />
        ))}
      </ScrollView>

      {selectedModel && (
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue with Selected Model</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#D1D5DB', marginBottom: 24 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  filterBtnActive: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  filterText: { color: '#D1D5DB', fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  continueBtn: { backgroundColor: '#8B5CF6', margin: 24, padding: 16, borderRadius: 12, alignItems: 'center' },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});