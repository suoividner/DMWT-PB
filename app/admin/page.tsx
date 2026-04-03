import AdminMarketForm from '@/components/AdminMarketForm';
import { requireAdmin } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { centsToDollars, formatDate } from '@/lib/utils';

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createServerClient();

  const [{ data: markets }, { data: users }, { data: wallets }] = await Promise.all([
    supabase.from('markets').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, discord_username, is_admin, created_at').order('created_at', { ascending: false }),
    supabase.from('wallets').select('balance_cents')
  ]);

  const totalBalance = (wallets ?? []).reduce((sum, wallet) => sum + wallet.balance_cents, 0);

  return (
    <main className="page">
      <div className="container stack">
        <section className="split">
          <div className="panel stack">
            <span className="badge">Admin backend</span>
            <h1 style={{ margin: 0 }}>Manage markets</h1>
            <AdminMarketForm />
          </div>

          <div className="panel stack">
            <div>
              <div className="muted">Total users</div>
              <div className="kpi">{users?.length ?? 0}</div>
            </div>
            <div>
              <div className="muted">Combined bankroll remaining</div>
              <div className="kpi">{centsToDollars(totalBalance)}</div>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2 style={{ marginTop: 0 }}>Markets</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Status</th>
                <th>Close time</th>
              </tr>
            </thead>
            <tbody>
              {markets?.map((market) => (
                <tr key={market.id}>
                  <td><a href={`/market/${market.id}`}>{market.question}</a></td>
                  <td>{market.status}{market.outcome ? ` (${market.outcome})` : ''}</td>
                  <td>{formatDate(market.closes_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h2 style={{ marginTop: 0 }}>Users</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Discord name</th>
                <th>Admin</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  <td>{user.discord_username ?? user.id}</td>
                  <td>{user.is_admin ? 'Yes' : 'No'}</td>
                  <td>{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
