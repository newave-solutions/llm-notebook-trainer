/**
 * @file InteractiveWizard.tsx
 * @description Step-by-step wizard for AI content generation
 * @module components/organisms
 *
 * Multi-step wizard that guides users through:
 * Step 1: Model Selection
 * Step 2: Core Prompt Input
 * Step 3: Magic Controls (creativity, length, etc.)
 * Step 4: Execution & Results
 *
 * Completely abstracts technical complexity from users.
 *
 * @example
 * <InteractiveWizard
 *   onComplete={handleGeneration}
 *   onCancel={handleCancel}
 * />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import ModelSelector from '../molecules/ModelSelector';
import PromptInputArea from '../molecules/PromptInputArea';
import CreativitySlider from '../molecules/CreativitySlider';
import OutputLengthSelector from '../molecules/OutputLengthSelector';
import ResponseDisplay from '../molecules/ResponseDisplay';

interface WizardConfig {
  modelId: string;
  prompt: string;
  creativity: number;
  outputLength: 'short' | 'medium' | 'long';
}

interface InteractiveWizardProps {
  onComplete?: (config: WizardConfig) => void;
  onCancel?: () => void;
}

type WizardStep = 'model' | 'prompt' | 'controls' | 'execute';

const STEP_TITLES = {
  model: 'Choose Your AI',
  prompt: 'What Would You Like?',
  controls: 'Fine-Tune the Magic',
  execute: 'Generate & Review',
};

const STEP_DESCRIPTIONS = {
  model: 'Select the AI model that best fits your needs',
  prompt: 'Tell the AI what you want it to create',
  controls: 'Adjust creativity and response length',
  execute: 'Generate your content and review the results',
};

/**
 * Interactive wizard for guided AI generation
 *
 * @param {InteractiveWizardProps} props - Component props
 * @returns {JSX.Element} Wizard interface
 */
export default function InteractiveWizard({
  onComplete,
  onCancel,
}: InteractiveWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('model');
  const [config, setConfig] = useState<WizardConfig>({
    modelId: '',
    prompt: '',
    creativity: 0.7,
    outputLength: 'medium',
  });

  const steps: WizardStep[] = ['model', 'prompt', 'controls', 'execute'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 'model':
        return config.modelId !== '';
      case 'prompt':
        return config.prompt.trim().length >= 10;
      case 'controls':
        return true;
      case 'execute':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      onComplete?.(config);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    } else {
      onCancel?.();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'model':
        return (
          <View style={styles.stepContent}>
            <ModelSelector
              selectedModelId={config.modelId}
              onSelect={(modelId) =>
                setConfig((prev) => ({ ...prev, modelId }))
              }
            />
          </View>
        );

      case 'prompt':
        return (
          <View style={styles.stepContent}>
            <PromptInputArea
              value={config.prompt}
              onChange={(prompt) =>
                setConfig((prev) => ({ ...prev, prompt }))
              }
              placeholder="Describe what you want the AI to create..."
              showTemplates
              showTokenCount
            />
          </View>
        );

      case 'controls':
        return (
          <View style={styles.stepContent}>
            <ScrollView style={styles.controlsContainer}>
              <View style={styles.control}>
                <Text style={styles.controlTitle}>Creativity Level</Text>
                <Text style={styles.controlDescription}>
                  How creative should the AI be with its response?
                </Text>
                <CreativitySlider
                  value={config.creativity}
                  onChange={(creativity) =>
                    setConfig((prev) => ({ ...prev, creativity }))
                  }
                />
              </View>

              <View style={styles.control}>
                <Text style={styles.controlTitle}>Response Length</Text>
                <Text style={styles.controlDescription}>
                  How long should the response be?
                </Text>
                <OutputLengthSelector
                  selected={config.outputLength}
                  onSelect={(outputLength) =>
                    setConfig((prev) => ({ ...prev, outputLength }))
                  }
                />
              </View>
            </ScrollView>
          </View>
        );

      case 'execute':
        return (
          <View style={styles.stepContent}>
            <View style={styles.executeContainer}>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Ready to Generate</Text>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Model:</Text>
                  <Text style={styles.summaryValue}>{config.modelId}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Creativity:</Text>
                  <Text style={styles.summaryValue}>
                    {config.creativity < 0.5
                      ? 'Precise'
                      : config.creativity < 0.9
                      ? 'Balanced'
                      : 'Creative'}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Length:</Text>
                  <Text style={styles.summaryValue}>
                    {config.outputLength.charAt(0).toUpperCase() +
                      config.outputLength.slice(1)}
                  </Text>
                </View>
              </Card>

              <Button
                variant="primary"
                size="large"
                onPress={() => onComplete?.(config)}
                fullWidth
              >
                Generate Content
              </Button>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.stepIndicator}>
            Step {currentStepIndex + 1} of {steps.length}
          </Text>
          <Text style={styles.title}>{STEP_TITLES[currentStep]}</Text>
          <Text style={styles.description}>
            {STEP_DESCRIPTIONS[currentStep]}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.content}>{renderStepContent()}</View>

      <View style={styles.footer}>
        <Button
          variant="secondary"
          size="medium"
          onPress={handleBack}
          style={styles.footerButton}
        >
          {currentStepIndex === 0 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          variant="primary"
          size="medium"
          onPress={handleNext}
          disabled={!canProceed()}
          style={styles.footerButton}
        >
          {currentStepIndex === steps.length - 1 ? 'Generate' : 'Next'}
        </Button>
      </View>

      <View style={styles.stepDots}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={step}
            style={[
              styles.stepDot,
              index <= currentStepIndex && styles.stepDotActive,
            ]}
            onPress={() => {
              if (index <= currentStepIndex) {
                setCurrentStep(steps[index]);
              }
            }}
          />
        ))}
      </View>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerContent: {
    marginBottom: 16,
  },
  stepIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContent: {
    flex: 1,
  },
  controlsContainer: {
    flex: 1,
  },
  control: {
    marginBottom: 32,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  controlDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  executeContainer: {
    flex: 1,
  },
  summaryCard: {
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  footerButton: {
    flex: 1,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepDotActive: {
    backgroundColor: '#3B82F6',
    width: 24,
  },
});
