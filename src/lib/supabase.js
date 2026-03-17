import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create local client only if URL is reasonably valid
export const supabase = supabaseUrl.startsWith('http') 
  ? createClient(supabaseUrl, supabaseKey)
  : null;
