import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env',
    );
  }

  if (!client) {
    client = createClient(url, anonKey);
  }

  return client;
}

const RANK_UP_MIGRATION_HINT =
  'Rank Up needs database migration 006. In Supabase → SQL Editor, run the file supabase/migrations/006_turn_rotation.sql, then reload.';

/** Supabase/PostgREST errors are plain objects, not Error instances. */
export function formatSupabaseError(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    if (error.message.includes('turn_order') || error.message.includes('round-recap')) {
      return RANK_UP_MIGRATION_HINT;
    }
    return error.message;
  }
  if (error && typeof error === 'object') {
    const code = 'code' in error ? String(error.code) : '';
    const message =
      'message' in error && typeof error.message === 'string' ? error.message : '';

    if (
      code === '42703' &&
      (message.includes('turn_order') ||
        message.includes('turn_index') ||
        message.includes('round_number'))
    ) {
      return RANK_UP_MIGRATION_HINT;
    }

    if (code === '23514' && message.includes('rank_up_rooms_phase_check')) {
      return RANK_UP_MIGRATION_HINT;
    }

    if (message.length > 0) return message;
  }
  return fallback;
}
