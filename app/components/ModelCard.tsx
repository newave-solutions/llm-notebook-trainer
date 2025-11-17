
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    provider: string;
    contextWindow: string;
    speed: string;
    costPerToken: string;
    image: string;
    description: string;
  };
  onSelect: (modelId: string) => void;
  selected?: boolean;
}

export default function ModelCard({ model, onSelect, selected }: ModelCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onSelect(model.id)}
    >
      <Image source={{ uri: model.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{model.name}</Text>
        <Text style={styles.provider}>{model.provider}</Text>
        <Text style={styles.description}>{model.description}</Text>
        <View style={styles.specs}>
          <Text style={styles.spec}>{model.contextWindow}</Text>
          <Text style={styles.spec}>{model.speed}</Text>
          <Text style={styles.spec}>{model.costPerToken}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  selectedCard: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139,92,246,0.1)',
  },
  image: { width: 60, height: 60, borderRadius: 12, marginBottom: 12 },
  content: { gap: 8 },
  name: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  provider: { fontSize: 14, color: '#A78BFA' },
  description: { fontSize: 14, color: '#D1D5DB', marginTop: 4 },
  specs: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  spec: { fontSize: 12, color: '#9CA3AF', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});