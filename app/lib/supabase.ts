
import { createClient } from '@supabase/supabase-js';

// Initialize database client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and/or anonymous key not provided in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
