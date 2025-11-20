/**
 * @file ModelSelector.tsx
 * @description Interactive model selection with filtering
 * @module components/molecules
 *
 * Provides visual model selection with:
 * - Provider filtering
 * - Model cards with details
 * - Popular/recommended badges
 * - Cost indicators
 * - Search functionality
 *
 * @example
 * <ModelSelector
 *   selectedModelId={model}
 *   onSelect={setModel}
 *   providers={['openai', 'anthropic']}
 * />
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Badge from '../atoms/Badge';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import { AI_MODELS, AIModel } from '../../constants/models';

interface ModelSelectorProps {
  selectedModelId?: string;
  onSelect: (modelId: string) => void;
  providers?: string[];
  showSearch?: boolean;
}

/**
 * Visual model selection with filtering and search
 *
 * @param {ModelSelectorProps} props - Component props
 * @returns {JSX.Element} Model selector interface
 */
export default function ModelSelector({
  selectedModelId,
  onSelect,
  providers,
  showSearch = true,
}: ModelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // Get unique providers
  const availableProviders = useMemo(() => {
    const providerSet = new Set(AI_MODELS.map((m) => m.provider));
    return Array.from(providerSet);
  }, []);

  // Filter models
  const filteredModels = useMemo(() => {
    let filtered = AI_MODELS;

    // Filter by provider if specified
    if (providers && providers.length > 0) {
      filtered = filtered.filter((m) => providers.includes(m.provider));
    }

    // Filter by selected provider
    if (selectedProvider) {
      filtered = filtered.filter((m) => m.provider === selectedProvider);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.provider.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [providers, selectedProvider, searchQuery]);

  const getCostBadge = (cost: string) => {
    if (cost.includes('$$$')) return { variant: 'error' as const, text: 'Premium' };
    if (cost.includes('$$')) return { variant: 'warning' as const, text: 'Standard' };
    return { variant: 'success' as const, text: 'Budget' };
  };

  return (
    <View style={styles.container}>
      {showSearch && (
        <Input
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search models..."
          style={styles.searchInput}
        />
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.providerScroll}
      >
        <TouchableOpacity
          style={[
            styles.providerChip,
            !selectedProvider && styles.providerChipActive,
          ]}
          onPress={() => setSelectedProvider(null)}
        >
          <Text
            style={[
              styles.providerText,
              !selectedProvider && styles.providerTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {availableProviders.map((provider) => (
          <TouchableOpacity
            key={provider}
            style={[
              styles.providerChip,
              selectedProvider === provider && styles.providerChipActive,
            ]}
            onPress={() => setSelectedProvider(provider)}
          >
            <Text
              style={[
                styles.providerText,
                selectedProvider === provider && styles.providerTextActive,
              ]}
            >
              {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.modelsScroll}>
        {filteredModels.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No models found</Text>
          </Card>
        ) : (
          filteredModels.map((model) => {
            const isSelected = model.id === selectedModelId;
            const costBadge = getCostBadge(model.cost);

            return (
              <TouchableOpacity
                key={model.id}
                onPress={() => onSelect(model.id)}
                activeOpacity={0.7}
              >
                <Card
                  style={[
                    styles.modelCard,
                    isSelected && styles.modelCardSelected,
                  ]}
                >
                  <View style={styles.modelHeader}>
                    <Text style={styles.modelName}>{model.name}</Text>
                    <View style={styles.badges}>
                      {model.popular && (
                        <Badge variant="info" size="small">
                          Popular
                        </Badge>
                      )}
                      <Badge variant={costBadge.variant} size="small">
                        {costBadge.text}
                      </Badge>
                    </View>
                  </View>

                  <Text style={styles.modelDescription}>
                    {model.description}
                  </Text>

                  <View style={styles.modelFooter}>
                    <Text style={styles.modelProvider}>
                      {model.provider.toUpperCase()}
                    </Text>
                    <Text style={styles.modelContext}>
                      {model.contextWindow} context
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIcon}>✓</Text>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    marginBottom: 16,
  },
  providerScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  providerChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  providerChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  providerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  providerTextActive: {
    color: '#FFF',
  },
  modelsScroll: {
    flex: 1,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
  modelCard: {
    marginBottom: 12,
    padding: 16,
    position: 'relative',
  },
  modelCardSelected: {
    borderColor: '#3B82F6',
    borderWidth: 2,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  modelDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  modelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelProvider: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
    letterSpacing: 1,
  },
  modelContext: {
    fontSize: 11,
    color: '#64748B',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '700',
  },
});
