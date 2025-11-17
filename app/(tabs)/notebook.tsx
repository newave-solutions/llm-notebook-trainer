import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import NotebookCell from '../components/NotebookCell';
import { supabase } from '../lib/supabase';

export default function NotebookScreen() {
  const { projectId } = useLocalSearchParams();
  const [cells, setCells] = useState([
    { id: '1', type: 'code', content: '', output: '' },
  ]);

  const handleContentChange = (id: string, content: string) => {
    setCells(cells.map(c => c.id === id ? { ...c, content } : c));
  };

  const handleExecute = async (id: string) => {
    const cell = cells.find(c => c.id === id);
    if (!cell) return;

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt: cell.content,
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 500,
        },
      });

      if (error) throw error;

      const output = data?.choices?.[0]?.message?.content || 'No response';
      setCells(cells.map(c => c.id === id ? { ...c, output } : c));
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const addCell = () => {
    setCells([...cells, { id: Date.now().toString(), type: 'code', content: '', output: '' }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Notebook</Text>
        <TouchableOpacity style={styles.addButton} onPress={addCell}>
          <Text style={styles.addButtonText}>+ Add Cell</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {cells.map((cell) => (
          <NotebookCell
            key={cell.id}
            cellType={cell.type as 'code' | 'markdown'}
            content={cell.content}
            output={cell.output}
            onContentChange={(content) => handleContentChange(cell.id, content)}
            onExecute={() => handleExecute(cell.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  title: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  addButton: { backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  scroll: { flex: 1, padding: 24 },
});