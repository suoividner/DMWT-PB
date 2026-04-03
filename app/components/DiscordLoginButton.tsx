'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AUTH_KEY = 'dmwt-demo-auth';

export function DiscordLoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    localStorage.setItem(AUTH_KEY, 'signed-in');
    router.push('/bets');
  };

  return (
    <button className="discord-button" onClick={signIn} disabled={loading}>
      <span className="discord-dot" aria-hidden>
        ◉
      </span>
      {loading ? 'Connecting to Discord...' : 'Log in with Discord'}
    </button>
  );
}

export { AUTH_KEY };
