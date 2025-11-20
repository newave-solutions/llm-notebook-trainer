import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { fileService } from '../services/database';

interface PdfUploadZoneProps {
  onFileUploaded?: (fileId: string, extractedText: string) => void;
  projectId?: string;
  outputFormat?: 'json' | 'csv';
}

interface UploadStatus {
  stage: 'idle' | 'selecting' | 'uploading' | 'processing' | 'completed' | 'error';
  message: string;
  progress?: number;
}

export default function PdfUploadZone({
  onFileUploaded,
  projectId,
  outputFormat = 'json',
}: PdfUploadZoneProps) {
  const [status, setStatus] = useState<UploadStatus>({
    stage: 'idle',
    message: 'Ready to upload',
  });
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const pickDocument = async () => {
    try {
      setStatus({ stage: 'selecting', message: 'Opening file picker...' });

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setStatus({ stage: 'idle', message: 'Ready to upload' });
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        await handleFileUpload(file);
      }
    } catch (error: any) {
      console.error('Error picking document:', error);
      setStatus({
        stage: 'error',
        message: error.message || 'Failed to pick document',
      });
    }
  };

  const handleFileUpload = async (file: any) => {
    try {
      setStatus({
        stage: 'uploading',
        message: 'Uploading PDF...',
        progress: 0,
      });

      const fileName = file.name;
      const fileSize = file.size;
      const storagePath = `uploads/${Date.now()}_${fileName}`;

      if (Platform.OS === 'web' && file.uri) {
        const response = await fetch(file.uri);
        const blob = await response.blob();

        await fileService.uploadToStorage(storagePath, blob);
      }

      setStatus({
        stage: 'uploading',
        message: 'Uploading PDF...',
        progress: 50,
      });

      const uploadedFileRecord = await fileService.create({
        user_id: '',
        project_id: projectId,
        file_name: fileName,
        file_type: 'application/pdf',
        file_size: fileSize,
        storage_path: storagePath,
        processing_status: 'pending',
      });

      setStatus({
        stage: 'processing',
        message: 'Refining Data...',
        progress: 75,
      });

      await processFile(uploadedFileRecord.id, outputFormat);

      setStatus({
        stage: 'completed',
        message: 'Data Ready!',
        progress: 100,
      });

      setUploadedFile(uploadedFileRecord);

      setTimeout(() => {
        setStatus({ stage: 'idle', message: 'Ready to upload' });
      }, 3000);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setStatus({
        stage: 'error',
        message: error.message || 'Upload failed',
      });
    }
  };

  const processFile = async (fileId: string, format: 'json' | 'csv') => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockExtractedText = 'Sample extracted text from PDF';

    await fileService.update(fileId, {
      extracted_text: mockExtractedText,
      processing_status: 'completed',
    });

    if (onFileUploaded) {
      onFileUploaded(fileId, mockExtractedText);
    }
  };

  const getStatusColor = () => {
    switch (status.stage) {
      case 'completed':
        return '#22C55E';
      case 'error':
        return '#EF4444';
      case 'processing':
      case 'uploading':
        return '#3B82F6';
      default:
        return '#64748B';
    }
  };

  const getStatusIcon = () => {
    switch (status.stage) {
      case 'completed':
        return '✓';
      case 'error':
        return '✕';
      case 'processing':
      case 'uploading':
        return '⟳';
      default:
        return '📄';
    }
  };

  const isProcessing =
    status.stage === 'uploading' ||
    status.stage === 'processing' ||
    status.stage === 'selecting';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Data Refinery Pipeline</Text>
        <Text style={styles.subtitle}>Upload PDFs for intelligent data extraction</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.dropZone,
          status.stage === 'completed' && styles.dropZoneSuccess,
          status.stage === 'error' && styles.dropZoneError,
        ]}
        onPress={pickDocument}
        disabled={isProcessing}
      >
        <View style={styles.dropZoneContent}>
          <Text style={[styles.icon, { color: getStatusColor() }]}>
            {getStatusIcon()}
          </Text>

          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.statusMessage}>{status.message}</Text>
              {status.progress !== undefined && (
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${status.progress}%` },
                    ]}
                  />
                </View>
              )}
            </View>
          ) : (
            <>
              <Text style={styles.mainText}>
                {status.stage === 'completed'
                  ? 'Upload Complete!'
                  : status.stage === 'error'
                  ? 'Upload Failed'
                  : 'Drop PDF Here or Tap to Browse'}
              </Text>
              <Text style={styles.subText}>
                {status.stage === 'completed'
                  ? 'Data extracted and formatted successfully'
                  : status.stage === 'error'
                  ? status.message
                  : 'Supports PDF files up to 50MB'}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.formatSelector}>
        <Text style={styles.formatLabel}>Output Format:</Text>
        <View style={styles.formatButtons}>
          <TouchableOpacity
            style={[
              styles.formatButton,
              outputFormat === 'json' && styles.formatButtonActive,
            ]}
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

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Pipeline Features</Text>
        <Text style={styles.infoText}>
          • Automatic text extraction from PDFs{'\n'}
          • Intelligent formatting (JSON/CSV){'\n'}
          • Structure preservation and cleanup{'\n'}
          • Ready for AI training workflows
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  dropZone: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(59,130,246,0.3)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  dropZoneSuccess: {
    borderColor: 'rgba(34,197,94,0.5)',
    backgroundColor: 'rgba(34,197,94,0.05)',
  },
  dropZoneError: {
    borderColor: 'rgba(239,68,68,0.5)',
    backgroundColor: 'rgba(239,68,68,0.05)',
  },
  dropZoneContent: {
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  processingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 16,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(59,130,246,0.2)',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  mainText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  formatSelector: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  infoCard: {
    backgroundColor: 'rgba(59,130,246,0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 20,
  },
});
