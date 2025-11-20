import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { projectService } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import PdfUploadZone from '../components/PdfUploadZone';

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { modelId } = useLocalSearchParams();
  const [projectName, setProjectName] = useState('');
  const [goal, setGoal] = useState('');
  const [outputFormat, setOutputFormat] = useState<'json' | 'csv'>('json');
  const [trainingData, setTrainingData] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'Generate product descriptions',
    'Summarize documents',
    'Extract entities from text',
    'Classify customer feedback',
    'Generate creative content',
    'Answer questions from data',
  ];

  const handleFileUploaded = (fileId: string, extractedText: string) => {
    setTrainingData(extractedText);
    Alert.alert('Success', 'Training data extracted successfully!');
  };

  const handleCreateProject = async () => {
    if (!projectName || !goal) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a project');
      return;
    }

    setLoading(true);
    try {
      const project = await projectService.create({
        user_id: user.id,
        name: projectName,
        goal: goal,
        model_name: (modelId as string) || 'gpt-4-turbo',
        model_type: 'openai',
        status: 'draft',
        training_data: trainingData,
        training_data_format: outputFormat,
        settings: {
          temperature: 0.7,
          maxTokens: 1000,
        },
      });

      Alert.alert('Success', 'Project created successfully!', [
        {
          text: 'OK',
          onPress: () =>
            router.push({ pathname: '/notebook', params: { projectId: project.id } }),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create project');
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

        <PdfUploadZone
          onFileUploaded={handleFileUploaded}
          outputFormat={outputFormat}
        />

        <View style={styles.formatToggle}>
          <Text style={styles.formatLabel}>Output Format:</Text>
          <View style={styles.formatButtons}>
            <TouchableOpacity
              style={[
                styles.formatButton,
                outputFormat === 'json' && styles.formatButtonActive,
              ]}
              onPress={() => setOutputFormat('json')}
            >
              <Text
                style={[
                  styles.formatButtonText,
                  outputFormat === 'json' && styles.formatButtonTextActive,
                ]}
              >
                JSON
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.formatButton,
                outputFormat === 'csv' && styles.formatButtonActive,
              ]}
              onPress={() => setOutputFormat('csv')}
            >
              <Text
                style={[
                  styles.formatButtonText,
                  outputFormat === 'csv' && styles.formatButtonTextActive,
                ]}
              >
                CSV
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
  subtitle: { fontSize: 16, color: '#64748B', marginBottom: 32 },
  form: { gap: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  suggestionsLabel: { fontSize: 14, color: '#60A5FA', fontWeight: '600', marginTop: 8 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  chipText: { color: '#60A5FA', fontSize: 13 },
  formatToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  formatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  formatButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  formatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  formatButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  formatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  formatButtonTextActive: {
    color: '#FFF',
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});