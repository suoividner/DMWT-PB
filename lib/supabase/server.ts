import { cookies } from 'next/headers';
import { createServerClient as createSupabaseServerClient, type SetAllCookies } from '@supabase/ssr';
import { env } from '@/lib/env';

export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // ignored in server components
        }
      }
    }
  });
}
