import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { apiKeyService, ApiKey } from '../services/database';

interface Provider {
  id: 'openai' | 'anthropic' | 'google' | 'azure' | 'deepseek';
  name: string;
  placeholder: string;
  icon: string;
}

const PROVIDERS: Provider[] = [
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-...', icon: '🤖' },
  { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...', icon: '🧠' },
  { id: 'google', name: 'Google Cloud', placeholder: 'AIza...', icon: '🔍' },
  { id: 'azure', name: 'Microsoft Azure', placeholder: 'abc123...', icon: '☁️' },
  { id: 'deepseek', name: 'DeepSeek', placeholder: 'ds-...', icon: '🔬' },
];

export default function ApiKeysVault() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const keys = await apiKeyService.getAll();
      const saved: Record<string, boolean> = {};
      keys.forEach((key) => {
        saved[key.provider] = key.is_active;
      });
      setSavedKeys(saved);
    } catch (error: any) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (provider: Provider) => {
    const keyValue = apiKeys[provider.id];

    if (!keyValue || keyValue.trim().length === 0) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    setSaving(provider.id);

    try {
      await apiKeyService.upsert({
        user_id: '',
        provider: provider.id,
        api_key: keyValue,
        is_active: true,
      });

      setSavedKeys({ ...savedKeys, [provider.id]: true });
      setApiKeys({ ...apiKeys, [provider.id]: '' });
      Alert.alert('Success', `${provider.name} API key saved securely`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save API key');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (provider: Provider) => {
    Alert.alert(
      'Delete API Key',
      `Are you sure you want to delete your ${provider.name} API key?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiKeyService.delete(provider.id);
              setSavedKeys({ ...savedKeys, [provider.id]: false });
              Alert.alert('Success', 'API key deleted');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete API key');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>API & Cloud Integration</Text>
        <Text style={styles.subtitle}>
          Securely store your API keys for multi-cloud model access
        </Text>
      </View>

      <View style={styles.warningCard}>
        <Text style={styles.warningIcon}>🔒</Text>
        <View style={styles.warningContent}>
          <Text style={styles.warningTitle}>Enterprise-Grade Security</Text>
          <Text style={styles.warningText}>
            Keys are encrypted at rest and never exposed in logs or responses
          </Text>
        </View>
      </View>

      {PROVIDERS.map((provider) => (
        <View key={provider.id} style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <View style={styles.providerInfo}>
              <Text style={styles.providerIcon}>{provider.icon}</Text>
              <Text style={styles.providerName}>{provider.name}</Text>
            </View>
            {savedKeys[provider.id] && (
              <View style={styles.activeIndicator}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            )}
          </View>

          {savedKeys[provider.id] ? (
            <View style={styles.savedKeyContainer}>
              <Text style={styles.savedKeyText}>••••••••••••••••</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(provider)}
              >
                <Text style={styles.deleteButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={provider.placeholder}
                placeholderTextColor="#64748B"
                value={apiKeys[provider.id] || ''}
                onChangeText={(text) =>
                  setApiKeys({ ...apiKeys, [provider.id]: text })
                }
                secureTextEntry={!showKey[provider.id]}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() =>
                    setShowKey({ ...showKey, [provider.id]: !showKey[provider.id] })
                  }
                >
                  <Text style={styles.toggleButtonText}>
                    {showKey[provider.id] ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    saving === provider.id && styles.saveButtonDisabled,
                  ]}
                  onPress={() => handleSave(provider)}
                  disabled={saving === provider.id}
                >
                  {saving === provider.id ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How to Get API Keys</Text>
        <Text style={styles.infoText}>
          • OpenAI: platform.openai.com/api-keys{'\n'}
          • Anthropic: console.anthropic.com{'\n'}
          • Google Cloud: console.cloud.google.com{'\n'}
          • Azure: portal.azure.com{'\n'}
          • DeepSeek: platform.deepseek.com
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  warningCard: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60A5FA',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  providerCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  savedKeyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedKeyText: {
    fontSize: 14,
    color: '#94A3B8',
    letterSpacing: 2,
  },
  deleteButton: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'rgba(59,130,246,0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
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
