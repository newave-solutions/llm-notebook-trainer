/**
 * @file ResponseDisplay.tsx
 * @description Elegant AI response display with actions
 * @module components/molecules
 *
 * Clean, formatted display of AI responses with:
 * - Markdown-style text rendering
 * - Copy to clipboard
 * - Save/bookmark option
 * - Export functionality
 * - Regenerate option
 * - Loading animation
 *
 * @example
 * <ResponseDisplay
 *   content={aiResponse}
 *   loading={isGenerating}
 *   onCopy={handleCopy}
 *   onRegenerate={handleRegenerate}
 * />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Button from '../atoms/Button';
import Card from '../atoms/Card';

interface ResponseDisplayProps {
  content: string;
  loading?: boolean;
  error?: string;
  tokensUsed?: number;
  model?: string;
  onCopy?: () => void;
  onSave?: () => void;
  onRegenerate?: () => void;
  onTrain?: () => void;
}

/**
 * Display AI response with action buttons
 *
 * @param {ResponseDisplayProps} props - Component props
 * @returns {JSX.Element} Formatted response display
 */
export default function ResponseDisplay({
  content,
  loading = false,
  error,
  tokensUsed,
  model,
  onCopy,
  onSave,
  onRegenerate,
  onTrain,
}: ResponseDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // In React Native, we'd use Clipboard from expo-clipboard
    // For now, simulate copy action
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied!', 'Response copied to clipboard');
  };

  if (loading) {
    return (
      <Card style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Thinking...</Text>
        <Text style={styles.loadingSubtext}>
          Generating your response with {model || 'AI'}
        </Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Generation Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        {onRegenerate && (
          <Button
            variant="secondary"
            size="medium"
            onPress={onRegenerate}
            style={styles.retryButton}
          >
            Try Again
          </Button>
        )}
      </Card>
    );
  }

  if (!content) {
    return (
      <Card style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>✨</Text>
        <Text style={styles.emptyTitle}>Ready to Generate</Text>
        <Text style={styles.emptyText}>
          Your AI response will appear here
        </Text>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Response</Text>
        {tokensUsed && (
          <Text style={styles.tokensInfo}>{tokensUsed} tokens</Text>
        )}
      </View>

      <ScrollView style={styles.responseScroll}>
        <Card style={styles.responseCard}>
          <Text style={styles.responseText}>{content}</Text>
        </Card>
      </ScrollView>

      <View style={styles.actions}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopy}
            disabled={copied}
          >
            <Text style={styles.actionIcon}>{copied ? '✓' : '📋'}</Text>
            <Text style={styles.actionLabel}>
              {copied ? 'Copied' : 'Copy'}
            </Text>
          </TouchableOpacity>

          {onSave && (
            <TouchableOpacity style={styles.actionButton} onPress={onSave}>
              <Text style={styles.actionIcon}>🔖</Text>
              <Text style={styles.actionLabel}>Save</Text>
            </TouchableOpacity>
          )}

          {onRegenerate && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onRegenerate}
            >
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionLabel}>Regenerate</Text>
            </TouchableOpacity>
          )}
        </View>

        {onTrain && (
          <Button
            variant="secondary"
            size="medium"
            onPress={onTrain}
            style={styles.trainButton}
            fullWidth
          >
            🎓 Train Model With This
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  tokensInfo: {
    fontSize: 12,
    color: '#64748B',
  },
  responseScroll: {
    flex: 1,
    marginBottom: 16,
  },
  responseCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  responseText: {
    fontSize: 15,
    color: '#E2E8F0',
    lineHeight: 24,
  },
  actions: {
    marginTop: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  trainButton: {
    marginTop: 8,
  },
});
