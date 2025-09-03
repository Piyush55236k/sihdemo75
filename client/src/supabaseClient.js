import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
  throw new Error('Supabase URL is required. Please check your environment variables.');
}

if (!SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  throw new Error('Supabase anonymous key is required. Please check your environment variables.');
}

console.log('Supabase config:', {
  url: SUPABASE_URL,
  hasKey: !!SUPABASE_ANON_KEY
});

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);