import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ModelCard from '../components/ModelCard';
import { AI_MODELS, MODEL_PROVIDERS } from '../constants/models';

export default function ModelsScreen() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const filteredModels = filter === 'All'
    ? AI_MODELS
    : AI_MODELS.filter(m => m.provider === filter);

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
        <Text style={styles.subtitle}>
          {AI_MODELS.length} models from leading providers
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filters}
        >
          {MODEL_PROVIDERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.resultCount}>
          {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'}
        </Text>

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
  subtitle: { fontSize: 16, color: '#64748B', marginBottom: 16 },
  filtersScroll: { marginBottom: 16 },
  filters: { flexDirection: 'row', gap: 8, paddingRight: 24 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  filterBtnActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  filterText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  resultCount: { fontSize: 14, color: '#64748B', marginBottom: 16 },
  continueBtn: { backgroundColor: '#3B82F6', margin: 24, padding: 16, borderRadius: 12, alignItems: 'center' },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});