import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';
import DataUpload from '../components/DataUpload';

export default function CreateScreen() {
  const router = useRouter();
  const { modelId } = useLocalSearchParams();
  const [projectName, setProjectName] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'Generate product descriptions',
    'Summarize documents',
    'Extract entities from text',
    'Classify customer feedback',
    'Generate creative content',
    'Answer questions from data',
  ];

  const handleCreateProject = async () => {
    if (!projectName || !goal) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: 'demo-user',
          name: projectName,
          goal: goal,
          model_name: modelId || 'gpt-3.5-turbo',
          model_type: 'openai',
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      Alert.alert('Success', 'Project created!', [
        { text: 'OK', onPress: () => router.push({ pathname: '/notebook', params: { projectId: data.id } }) }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Project</Text>
      <Text style={styles.subtitle}>Define your training goal and upload data</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Project Name</Text>
        <TextInput
          style={styles.input}
          value={projectName}
          onChangeText={setProjectName}
          placeholder="My AI Project"
          placeholderTextColor="#6B7280"
        />

        <Text style={styles.label}>Training Goal</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={goal}
          onChangeText={setGoal}
          placeholder="Describe what you want the AI to do..."
          placeholderTextColor="#6B7280"
          multiline
        />

        <Text style={styles.suggestionsLabel}>Suggestions:</Text>
        <View style={styles.suggestions}>
          {suggestions.map((s, i) => (
            <TouchableOpacity key={i} style={styles.chip} onPress={() => setGoal(s)}>
              <Text style={styles.chipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Upload Training Data</Text>
        <DataUpload onFileSelect={(file) => console.log('File selected:', file)} />


        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreateProject}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Project'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#D1D5DB', marginBottom: 32 },
  form: { gap: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  suggestionsLabel: { fontSize: 14, color: '#A78BFA', fontWeight: '600', marginTop: 8 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: 'rgba(139,92,246,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#8B5CF6' },
  chipText: { color: '#A78BFA', fontSize: 13 },
  button: { backgroundColor: '#8B5CF6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});