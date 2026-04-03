import MarketCard from '@/components/MarketCard';
import { LoginButton } from '@/components/AuthButton';
import { createServerClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: markets } = await supabase
    .from('markets')
    .select('*')
    .order('status', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <div className="panel">
            <span className="badge">Fake money prediction market</span>
            <h1 style={{ fontSize: '3rem', marginBottom: 12 }}>Make bets with friends, not real money.</h1>
            <p className="muted" style={{ maxWidth: 700, fontSize: '1.05rem' }}>
              Discord-based sign in, instant $1,000 bankroll on first login, live YES/NO pricing, and an admin dashboard for creating and resolving markets.
            </p>
            <div className="row" style={{ marginTop: 18 }}>
              {user ? null : <LoginButton />}
              <span className="badge">Built for Vercel + Supabase</span>
            </div>
          </div>
          <div className="panel stack">
            <div>
              <div className="muted">Bankroll on signup</div>
              <div className="kpi">$1,000</div>
            </div>
            <div>
              <div className="muted">Market type</div>
              <div className="kpi">YES / NO</div>
            </div>
            <div className="notice">
              This build is a strong MVP inspired by Polymarket’s feel and flow. It includes the core game loop, but it is not a 1:1 clone of every production feature.
            </div>
          </div>
        </section>

        <section className="grid market-grid">
          {markets?.map((market) => <MarketCard key={market.id} market={market} />)}
        </section>
      </div>
    </main>
  );
}
