import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export async function requireUser() {
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  const supabase = await createServerClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/');
  return user;
}
