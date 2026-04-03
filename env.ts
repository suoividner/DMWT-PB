import { notFound } from 'next/navigation';
import TradeForm from '@/components/TradeForm';
import ResolveButtons from '@/components/ResolveButtons';
import { createServerClient } from '@/lib/supabase/server';
import { centsToDollars, formatDate, getNoPriceCents, getYesPriceCents } from '@/lib/utils';

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: market } = await supabase.from('markets').select('*').eq('id', id).single();
  if (!market) notFound();

  const yesPrice = getYesPriceCents(market);
  const noPrice = getNoPriceCents(market);

  const [{ data: holdings }, { data: trades }, { data: profile }] = await Promise.all([
    user
      ? supabase
          .from('user_market_holdings')
          .select('*')
          .eq('user_id', user.id)
          .eq('market_id', market.id)
          .single()
      : Promise.resolve({ data: null }),
    supabase
      .from('trades')
      .select('id, side, spend_cents, shares, created_at')
      .eq('market_id', market.id)
      .order('created_at', { ascending: false })
      .limit(20),
    user
      ? supabase.from('profiles').select('is_admin').eq('id', user.id).single()
      : Promise.resolve({ data: null })
  ]);

  return (
    <main className="page">
      <div className="container split">
        <section className="stack">
          <div className="panel stack">
            <div className="row">
              <span className="badge">{market.category ?? 'General'}</span>
              <span className="badge">{market.status.toUpperCase()}</span>
              {market.outcome ? <span className="badge">Resolved: {market.outcome.toUpperCase()}</span> : null}
            </div>
            <h1 style={{ margin: 0 }}>{market.question}</h1>
            <p className="muted" style={{ margin: 0 }}>{market.description ?? 'No description provided.'}</p>
            <div className="row">
              <span className="price-pill yes">YES {yesPrice}¢</span>
              <span className="price-pill no">NO {noPrice}¢</span>
            </div>
            <div className="notice">Trading closes {formatDate(market.closes_at)}. Winning shares settle at $1 each when the admin resolves the market.</div>
          </div>

          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Recent trades</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Side</th>
                  <th>Spent</th>
                  <th>Shares</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {trades?.map((trade) => (
                  <tr key={trade.id}>
                    <td style={{ textTransform: 'uppercase' }}>{trade.side}</td>
                    <td>{centsToDollars(trade.spend_cents)}</td>
                    <td>{Number(trade.shares).toFixed(2)}</td>
                    <td>{formatDate(trade.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="stack">
          {user ? (
            <div className="panel stack">
              <h2 style={{ margin: 0 }}>Your position</h2>
              <div className="notice">YES shares: {Number(holdings?.yes_shares ?? 0).toFixed(2)}</div>
              <div className="notice">NO shares: {Number(holdings?.no_shares ?? 0).toFixed(2)}</div>
              {market.status === 'active' ? <TradeForm marketId={market.id} /> : <div className="notice">This market is no longer active for trading.</div>}
            </div>
          ) : (
            <div className="panel"><p className="muted">Sign in to trade this market.</p></div>
          )}

          {profile?.is_admin && market.status === 'active' ? (
            <div className="panel stack">
              <h2 style={{ margin: 0 }}>Admin resolve</h2>
              <ResolveButtons marketId={market.id} />
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
