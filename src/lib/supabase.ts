import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Supabase client, or null when not configured. The app works fully without it
 * (reports then stay on this device). Only the public anon key belongs here;
 * never put a service_role key in front-end code.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export const remoteEnabled = supabase !== null
