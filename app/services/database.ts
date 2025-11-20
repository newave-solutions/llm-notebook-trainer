import { supabase } from '../lib/supabase';

export interface ApiKey {
  id: string;
  user_id: string;
  provider: 'openai' | 'anthropic' | 'google' | 'azure' | 'deepseek';
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UploadedFile {
  id: string;
  user_id: string;
  project_id?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  extracted_text?: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  goal: string;
  model_name: string;
  model_type: string;
  status: string;
  training_data?: string;
  training_data_format?: 'json' | 'csv';
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface NotebookCell {
  id: string;
  project_id: string;
  cell_type: string;
  content: string;
  output: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingSession {
  id: string;
  project_id: string;
  status: string;
  progress: number;
  tokens_used: number;
  estimated_cost: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  created_at: string;
}

export interface TrainingResult {
  id: string;
  session_id: string;
  input_text: string;
  output_text: string;
  quality_score: number;
  tokens_used: number;
  created_at: string;
}

export const projectService = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Project | null;
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  async update(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const notebookService = {
  async getCellsByProject(projectId: string) {
    const { data, error } = await supabase
      .from('notebook_cells')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data as NotebookCell[];
  },

  async createCell(cell: Omit<NotebookCell, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('notebook_cells')
      .insert([cell])
      .select()
      .single();

    if (error) throw error;
    return data as NotebookCell;
  },

  async updateCell(id: string, updates: Partial<NotebookCell>) {
    const { data, error } = await supabase
      .from('notebook_cells')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as NotebookCell;
  },

  async deleteCell(id: string) {
    const { error } = await supabase
      .from('notebook_cells')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const apiKeyService = {
  async getAll() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('provider', { ascending: true });

    if (error) throw error;
    return data as ApiKey[];
  },

  async getByProvider(provider: string) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('provider', provider)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data as ApiKey | null;
  },

  async upsert(apiKey: Omit<ApiKey, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('api_keys')
      .upsert(
        [{ ...apiKey, updated_at: new Date().toISOString() }],
        { onConflict: 'user_id,provider' }
      )
      .select()
      .single();

    if (error) throw error;
    return data as ApiKey;
  },

  async delete(provider: string) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('provider', provider);

    if (error) throw error;
  },
};

export const fileService = {
  async getAll() {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as UploadedFile[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as UploadedFile | null;
  },

  async create(file: Omit<UploadedFile, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('uploaded_files')
      .insert([file])
      .select()
      .single();

    if (error) throw error;
    return data as UploadedFile;
  },

  async update(id: string, updates: Partial<UploadedFile>) {
    const { data, error } = await supabase
      .from('uploaded_files')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as UploadedFile;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('uploaded_files')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadToStorage(filePath: string, file: Blob) {
    const { data, error } = await supabase.storage
      .from('training-data')
      .upload(filePath, file);

    if (error) throw error;
    return data;
  },
};

export const trainingService = {
  async getSessionsByProject(projectId: string) {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TrainingSession[];
  },

  async createSession(session: Omit<TrainingSession, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('training_sessions')
      .insert([session])
      .select()
      .single();

    if (error) throw error;
    return data as TrainingSession;
  },

  async updateSession(id: string, updates: Partial<TrainingSession>) {
    const { data, error } = await supabase
      .from('training_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as TrainingSession;
  },

  async getResults(sessionId: string) {
    const { data, error } = await supabase
      .from('training_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as TrainingResult[];
  },

  async createResult(result: Omit<TrainingResult, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('training_results')
      .insert([result])
      .select()
      .single();

    if (error) throw error;
    return data as TrainingResult;
  },
};
