/**
 * @file PromptInputArea.tsx
 * @description Enhanced prompt input with templates and validation
 * @module components/molecules
 *
 * A sophisticated prompt input area with:
 * - Auto-growing textarea
 * - Character/token counter
 * - Quick prompt templates
 * - Real-time validation
 * - Helpful suggestions
 *
 * @example
 * <PromptInputArea
 *   value={prompt}
 *   onChange={setPrompt}
 *   onTemplateSelect={handleTemplate}
 * />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Input from '../atoms/Input';

interface PromptTemplate {
  label: string;
  prompt: string;
  icon: string;
}

interface PromptInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onTemplateSelect?: (template: string) => void;
  maxLength?: number;
  showTemplates?: boolean;
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    label: 'Summarize',
    prompt: 'Summarize the following text into key points...',
    icon: '📋',
  },
  {
    label: 'Generate',
    prompt: 'Generate creative content about...',
    icon: '✨',
  },
  {
    label: 'Extract',
    prompt: 'Extract key information from...',
    icon: '🔍',
  },
  {
    label: 'Answer',
    prompt: 'Answer questions about...',
    icon: '💬',
  },
  {
    label: 'Explain',
    prompt: 'Explain the concept of...',
    icon: '📚',
  },
  {
    label: 'Analyze',
    prompt: 'Analyze and provide insights on...',
    icon: '📊',
  },
];

/**
 * Enhanced prompt input area with templates
 *
 * @param {PromptInputAreaProps} props - Component props
 * @returns {JSX.Element} Prompt input with templates and validation
 */
export default function PromptInputArea({
  value,
  onChange,
  onTemplateSelect,
  maxLength = 2000,
  showTemplates = true,
}: PromptInputAreaProps) {
  const charCount = value.length;
  const isShort = charCount < 20;
  const isLong = charCount > maxLength * 0.9;

  const handleTemplateSelect = (template: string) => {
    onChange(template);
    onTemplateSelect?.(template);
  };

  // Estimate token count (rough approximation)
  const estimatedTokens = Math.ceil(charCount / 4);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What Is Your Desired Outcome?</Text>
      <Text style={styles.subtitle}>
        Describe your goal in natural language
      </Text>

      <Input
        value={value}
        onChange={onChange}
        placeholder="Example: Summarize customer feedback into key themes and actionable insights..."
        multiline
        maxLength={maxLength}
        showCharCount
        helperText={
          isShort
            ? 'Try to be more specific (recommended: 20-500 characters)'
            : `~${estimatedTokens} tokens`
        }
      />

      {showTemplates && (
        <View style={styles.templatesSection}>
          <Text style={styles.templatesLabel}>Quick Templates</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templatesScroll}
          >
            {PROMPT_TEMPLATES.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.templateChip}
                onPress={() => handleTemplateSelect(template.prompt)}
              >
                <Text style={styles.templateIcon}>{template.icon}</Text>
                <Text style={styles.templateLabel}>{template.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {value.length > 0 && (
        <View style={styles.tips}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Pro Tip</Text>
            <Text style={styles.tipText}>
              {isShort
                ? 'Add more context to get better results'
                : 'Great! Clear prompts lead to better AI responses'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  templatesSection: {
    marginTop: 16,
  },
  templatesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 12,
  },
  templatesScroll: {
    gap: 8,
    paddingRight: 24,
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  templateIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  templateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#60A5FA',
  },
  tips: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59,130,246,0.05)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.1)',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
});
