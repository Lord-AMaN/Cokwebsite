import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // createClient throws synchronously on an empty URL, which crashes the whole
  // app at import time (Footer pulls this in on every route). Fall back to a
  // syntactically valid placeholder so the site still renders when Supabase
  // env vars aren't configured; Supabase-backed features just no-op instead.
  console.warn('Supabase env vars are not set — Supabase-backed features (visit counter, checkout, admin, etc.) are disabled.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
