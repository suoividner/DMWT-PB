'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_KEY } from '../components/DiscordLoginButton';

const ACTIVE_BETS = [
  { id: 1, title: 'Will SOL hit $300 before August 1?', yes: 54, volume: '$184k' },
  { id: 2, title: 'Will an AI pass US CPA exam in 2026?', yes: 67, volume: '$96k' },
  { id: 3, title: 'Will the Fed cut rates at the next meeting?', yes: 41, volume: '$212k' },
  { id: 4, title: 'Will a crypto ETF for DOGE launch in 2026?', yes: 33, volume: '$71k' }
];

export default function BetsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isSignedIn = localStorage.getItem(AUTH_KEY) === 'signed-in';
    if (!isSignedIn) {
      router.replace('/');
      return;
    }
    setReady(true);
  }, [router]);

  const bets = useMemo(() => ACTIVE_BETS, []);

  if (!ready) {
    return <main className="shell">Checking sign-in…</main>;
  }

  return (
    <main className="shell bets-shell">
      <header className="bets-header">
        <div>
          <p className="eyebrow">ACTIVE MARKETS</p>
          <h1>All currently active bets</h1>
        </div>
        <button
          className="ghost-button"
          onClick={() => {
            localStorage.removeItem(AUTH_KEY);
            router.push('/');
          }}
        >
          Log out
        </button>
      </header>

      <section className="bets-grid">
        {bets.map((bet) => (
          <article key={bet.id} className="bet-tile">
            <h3>{bet.title}</h3>
            <div className="tile-meta">
              <span>YES {bet.yes}%</span>
              <span>NO {100 - bet.yes}%</span>
              <span>Vol {bet.volume}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
