
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import SettingsPanel from '../components/SettingsPanel';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Configure your AI model parameters</Text>

      <View style={styles.userCard}>
        <Text style={styles.userLabel}>Signed in as</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <SettingsPanel
        temperature={temperature}
        maxTokens={maxTokens}
        onTemperatureChange={setTemperature}
        onMaxTokensChange={setMaxTokens}
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Model Parameters</Text>
        <Text style={styles.infoText}>
          Temperature controls the randomness of responses. Lower values (0-0.5) make outputs more focused and deterministic, while higher values (1-2) increase creativity and variety.
        </Text>
        <Text style={styles.infoText}>
          Max Tokens limits the length of generated responses. One token is roughly 4 characters or 0.75 words.
        </Text>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748B', marginBottom: 24 },
  userCard: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  userLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  userEmail: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  infoCard: {
    backgroundColor: 'rgba(59,130,246,0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
    marginTop: 24,
  },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 12 },
  infoText: { fontSize: 14, color: '#94A3B8', lineHeight: 20, marginBottom: 8 },
  signOutBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  signOutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
});