import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AgentActivity } from '@/types/activity';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Singleton pattern to avoid multiple Supabase instances
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return supabaseInstance;
}

export type { AgentActivity };

export const isSupabaseConfigured =
  supabaseUrl !== '' &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== '' &&
  supabaseAnonKey !== 'placeholder_anon_key';
