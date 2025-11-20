/**
 * @file TrainingStudio.tsx
 * @description Interactive training through conversation
 * @module components/organisms
 *
 * Conversational training interface that:
 * - Collects prompt-response pairs through chat
 * - Allows users to rate quality (1-5 stars)
 * - Shows training progress and statistics
 * - Exports training data in multiple formats
 * - Recommends when ready for fine-tuning
 *
 * @example
 * <TrainingStudio
 *   sessionId={session.id}
 *   onComplete={handleTrainingComplete}
 * />
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import Badge from '../atoms/Badge';
import { trainingOrchestrator, TrainingPair } from '../../services/trainingOrchestrator';

interface TrainingStudioProps {
  sessionId: string;
  modelId: string;
  onComplete?: (exportedData: string) => void;
}

interface ConversationEntry {
  id: string;
  prompt: string;
  response: string;
  qualityScore?: number;
  timestamp: Date;
}

/**
 * Interactive training studio with conversation mode
 *
 * @param {TrainingStudioProps} props - Component props
 * @returns {JSX.Element} Training studio interface
 */
export default function TrainingStudio({
  sessionId,
  modelId,
  onComplete,
}: TrainingStudioProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [stats, setStats] = useState({
    totalPairs: 0,
    averageQuality: 0,
    highQualityPairs: 0,
    readyForTraining: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, [sessionId]);

  const loadStats = async () => {
    try {
      const sessionStats = await trainingOrchestrator.getSessionStats(sessionId);
      setStats(sessionStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleAddPair = async () => {
    if (!prompt.trim() || !response.trim()) {
      Alert.alert('Missing Data', 'Both prompt and response are required');
      return;
    }

    const validation = trainingOrchestrator.validateTrainingPair({
      prompt,
      response,
      qualityScore: 5,
    });

    if (!validation.isValid) {
      Alert.alert(
        'Validation Failed',
        validation.issues.join('\n') + '\n\n' + validation.suggestions.join('\n')
      );
      return;
    }

    const entry: ConversationEntry = {
      id: Date.now().toString(),
      prompt,
      response,
      qualityScore: undefined,
      timestamp: new Date(),
    };

    setConversations([entry, ...conversations]);
    setPrompt('');
    setResponse('');

    Alert.alert(
      'Rate This Pair',
      'How would you rate the quality of this response?',
      [
        {
          text: '⭐ Poor',
          onPress: () => ratePair(entry.id, 1),
        },
        {
          text: '⭐⭐ Fair',
          onPress: () => ratePair(entry.id, 2),
        },
        {
          text: '⭐⭐⭐ Good',
          onPress: () => ratePair(entry.id, 3),
        },
        {
          text: '⭐⭐⭐⭐ Great',
          onPress: () => ratePair(entry.id, 4),
        },
        {
          text: '⭐⭐⭐⭐⭐ Excellent',
          onPress: () => ratePair(entry.id, 5),
        },
      ]
    );
  };

  const ratePair = async (entryId: string, score: number) => {
    try {
      const entry = conversations.find((c) => c.id === entryId);
      if (!entry) return;

      await trainingOrchestrator.addTrainingPair(sessionId, {
        prompt: entry.prompt,
        response: entry.response,
        qualityScore: score,
      });

      setConversations(
        conversations.map((c) =>
          c.id === entryId ? { ...c, qualityScore: score } : c
        )
      );

      await loadStats();

      Alert.alert('Rated!', `Quality score: ${score}/5 stars`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save training pair');
    }
  };

  const handleExport = async () => {
    if (stats.totalPairs === 0) {
      Alert.alert('No Data', 'Add some training pairs before exporting');
      return;
    }

    Alert.alert(
      'Export Format',
      'Choose the export format for your training data',
      [
        {
          text: 'OpenAI JSONL',
          onPress: () => exportData('openai'),
        },
        {
          text: 'Anthropic JSON',
          onPress: () => exportData('anthropic'),
        },
        {
          text: 'CSV',
          onPress: () => exportData('csv'),
        },
        {
          text: 'Generic JSON',
          onPress: () => exportData('generic'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const exportData = async (format: 'openai' | 'anthropic' | 'csv' | 'generic') => {
    try {
      setLoading(true);
      const exportedData = await trainingOrchestrator.exportTrainingData(
        sessionId,
        { format, minQuality: 3 }
      );

      onComplete?.(exportedData);

      Alert.alert(
        'Export Complete',
        `Training data exported in ${format} format`
      );
    } catch (error: any) {
      Alert.alert('Export Failed', error.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (score?: number) => {
    if (!score) return '#64748B';
    if (score >= 4) return '#10B981';
    if (score >= 3) return '#F59E0B';
    return '#EF4444';
  };

  const getQualityStars = (score?: number) => {
    if (!score) return '☆☆☆☆☆';
    return '⭐'.repeat(score) + '☆'.repeat(5 - score);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Mode</Text>
        <Text style={styles.subtitle}>
          Build your training dataset through conversation
        </Text>
      </View>

      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.totalPairs}</Text>
            <Text style={styles.statLabel}>Total Pairs</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {stats.averageQuality.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Avg Quality</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.highQualityPairs}</Text>
            <Text style={styles.statLabel}>High Quality</Text>
          </View>
        </View>

        {stats.readyForTraining && (
          <Badge variant="success" size="medium" style={styles.readyBadge}>
            Ready for Training
          </Badge>
        )}
      </Card>

      <View style={styles.inputSection}>
        <Input
          value={prompt}
          onChange={setPrompt}
          placeholder="Enter your prompt..."
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Input
          value={response}
          onChange={setResponse}
          placeholder="Enter the ideal response..."
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          variant="primary"
          size="medium"
          onPress={handleAddPair}
          disabled={!prompt.trim() || !response.trim()}
          fullWidth
        >
          Add Training Pair
        </Button>
      </View>

      <View style={styles.conversationsHeader}>
        <Text style={styles.conversationsTitle}>
          Training Pairs ({conversations.length})
        </Text>
        <TouchableOpacity onPress={handleExport}>
          <Text style={styles.exportButton}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.conversations}>
        {conversations.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>No Pairs Yet</Text>
            <Text style={styles.emptyText}>
              Start adding prompt-response pairs to build your training dataset
            </Text>
          </Card>
        ) : (
          conversations.map((conv) => (
            <Card key={conv.id} style={styles.conversationCard}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationTime}>
                  {conv.timestamp.toLocaleTimeString()}
                </Text>
                {conv.qualityScore && (
                  <View
                    style={[
                      styles.qualityBadge,
                      {
                        backgroundColor: getQualityColor(conv.qualityScore) + '20',
                        borderColor: getQualityColor(conv.qualityScore),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.qualityText,
                        { color: getQualityColor(conv.qualityScore) },
                      ]}
                    >
                      {getQualityStars(conv.qualityScore)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.conversationContent}>
                <View style={styles.messageBlock}>
                  <Text style={styles.messageLabel}>Prompt:</Text>
                  <Text style={styles.messageText}>{conv.prompt}</Text>
                </View>

                <View style={styles.messageBlock}>
                  <Text style={styles.messageLabel}>Response:</Text>
                  <Text style={styles.messageText}>{conv.response}</Text>
                </View>
              </View>

              {!conv.qualityScore && (
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() =>
                    Alert.alert(
                      'Rate This Pair',
                      'How would you rate the quality?',
                      [
                        { text: '⭐ 1', onPress: () => ratePair(conv.id, 1) },
                        { text: '⭐⭐ 2', onPress: () => ratePair(conv.id, 2) },
                        { text: '⭐⭐⭐ 3', onPress: () => ratePair(conv.id, 3) },
                        { text: '⭐⭐⭐⭐ 4', onPress: () => ratePair(conv.id, 4) },
                        { text: '⭐⭐⭐⭐⭐ 5', onPress: () => ratePair(conv.id, 5) },
                      ]
                    )
                  }
                >
                  <Text style={styles.rateButtonText}>Rate Quality</Text>
                </TouchableOpacity>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  statsCard: {
    margin: 20,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  readyBadge: {
    alignSelf: 'center',
  },
  inputSection: {
    padding: 20,
    gap: 12,
  },
  input: {
    marginBottom: 0,
  },
  conversationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  conversationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  exportButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  conversations: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyCard: {
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
  conversationCard: {
    marginBottom: 12,
    padding: 16,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  conversationTime: {
    fontSize: 12,
    color: '#64748B',
  },
  qualityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  conversationContent: {
    gap: 12,
  },
  messageBlock: {
    gap: 4,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  messageText: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
  rateButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    alignItems: 'center',
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
