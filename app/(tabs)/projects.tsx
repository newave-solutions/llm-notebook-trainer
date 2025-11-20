import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { projectService, Project } from '../services/database';

export default function ProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'training': return '#F59E0B';
      case 'draft': return '#6B7280';
      default: return '#8B5CF6';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Projects</Text>
          <Text style={styles.headerSubtitle}>{projects.length} projects</Text>
        </View>
        <TouchableOpacity style={styles.newButton} onPress={() => router.push('/create')}>
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading projects...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadProjects}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : projects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No projects yet</Text>
            <Text style={styles.emptyText}>Create your first AI training project to get started</Text>
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/create')}>
              <Text style={styles.createButtonText}>Create Project</Text>
            </TouchableOpacity>
          </View>
        ) : (
          projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectCard}
              onPress={() => router.push({ pathname: '/notebook', params: { projectId: project.id } })}
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                  <Text style={styles.statusText}>{project.status}</Text>
                </View>
              </View>
              <Text style={styles.projectGoal}>{project.goal}</Text>
              <Text style={styles.projectModel}>Model: {project.model_name}</Text>
              <Text style={styles.projectDate}>
                {new Date(project.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  newButton: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  newButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  scroll: { flex: 1, padding: 24 },
  centerContent: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  loadingText: { color: '#64748B', fontSize: 16, marginTop: 16 },
  errorContainer: { alignItems: 'center', marginTop: 60 },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  retryButton: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderWidth: 1,
    borderColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: { color: '#3B82F6', fontSize: 14, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  createButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  projectCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: { fontSize: 20, fontWeight: '700', color: '#FFF', flex: 1, marginRight: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#FFF', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  projectGoal: { fontSize: 14, color: '#94A3B8', marginBottom: 8, lineHeight: 20 },
  projectModel: { fontSize: 12, color: '#60A5FA', fontWeight: '600', marginBottom: 4 },
  projectDate: { fontSize: 12, color: '#64748B', marginTop: 4 },
});