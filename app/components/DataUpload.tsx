
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

interface DataUploadProps {
  onFileSelect: (data: string) => void;
}

export default function DataUpload({ onFileSelect }: DataUploadProps) {
  const [dataText, setDataText] = useState('');
  const [fileName, setFileName] = useState('');

  const handlePaste = () => {
    if (dataText) {
      onFileSelect(dataText);
      setFileName('data.txt');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadZone}>
        <Text style={styles.uploadIcon}>📁</Text>
        <Text style={styles.uploadText}>
          {fileName || 'Paste your training data below'}
        </Text>
        <Text style={styles.uploadHint}>CSV, JSON, or plain text format</Text>
      </View>

      <TextInput
        style={styles.textInput}
        value={dataText}
        onChangeText={setDataText}
        placeholder="Paste your training data here..."
        placeholderTextColor="#6B7280"
        multiline
      />

      {dataText && (
        <TouchableOpacity style={styles.confirmButton} onPress={handlePaste}>
          <Text style={styles.confirmText}>Confirm Data</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  uploadZone: { backgroundColor: 'rgba(139,92,246,0.1)', borderWidth: 2, borderColor: '#8B5CF6', borderStyle: 'dashed', borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 16 },
  uploadIcon: { fontSize: 48, marginBottom: 12 },
  uploadText: { fontSize: 16, color: '#FFF', fontWeight: '600', marginBottom: 4 },
  uploadHint: { fontSize: 12, color: '#A78BFA' },
  textInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, color: '#FFF', fontSize: 14, minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  confirmButton: { backgroundColor: '#8B5CF6', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  confirmText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});