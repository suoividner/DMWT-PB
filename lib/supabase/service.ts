import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export function createServiceClient() {
  return createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
