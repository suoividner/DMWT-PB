'use client';

import { createClient } from '@/lib/supabase/client';

export function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  return (
    <button className="btn btn-primary" onClick={handleLogin}>
      Sign in with Discord
    </button>
  );
}

export function LogoutButton() {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return <button className="btn" onClick={handleLogout}>Log out</button>;
}
