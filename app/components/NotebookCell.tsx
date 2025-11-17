import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface NotebookCellProps {
  cellType: 'code' | 'markdown';
  content: string;
  output?: string;
  onContentChange: (content: string) => void;
  onExecute: () => void;
}

export default function NotebookCell({ cellType, content, output, onContentChange, onExecute }: NotebookCellProps) {
  return (
    <View style={styles.cell}>
      <View style={styles.header}>
        <Text style={styles.cellType}>{cellType === 'code' ? 'Code' : 'Markdown'}</Text>
        <TouchableOpacity style={styles.runButton} onPress={onExecute}>
          <Text style={styles.runButtonText}>Run</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, cellType === 'code' && styles.codeInput]}
        value={content}
        onChangeText={onContentChange}
        multiline
        placeholder={cellType === 'code' ? 'Enter code...' : 'Enter markdown...'}
        placeholderTextColor="#6B7280"
      />
      {output && (
        <View style={styles.output}>
          <Text style={styles.outputLabel}>Output:</Text>
          <Text style={styles.outputText}>{output}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cellType: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' },
  runButton: { backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  runButtonText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  input: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 12, color: '#FFF', fontSize: 14, minHeight: 80 },
  codeInput: { fontFamily: 'monospace' },
  output: { marginTop: 12, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: 12 },
  outputLabel: { fontSize: 12, color: '#A78BFA', fontWeight: '600', marginBottom: 6 },
  outputText: { color: '#D1D5DB', fontSize: 13, fontFamily: 'monospace' },
});