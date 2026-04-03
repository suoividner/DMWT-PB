import { DemoBetCard } from './components/DemoBetCard';
import { DiscordLoginButton } from './components/DiscordLoginButton';

export default function LandingPage() {
  return (
    <main className="shell">
      <section className="landing-grid">
        <div className="left-pane">
          <p className="eyebrow">DMWT MARKETS</p>
          <h1>Trade social prediction markets with a clean, Polymarket-inspired feel.</h1>
          <p className="subtext">
            We are starting fresh with a focused MVP: one sleek landing page, one animated demo market, and a Discord
            login flow that sends signed-in users to active bets.
          </p>
          <DemoBetCard />
        </div>

        <aside className="right-pane">
          <div className="auth-card">
            <h3>Join the market</h3>
            <p>Sign in to access all currently active bets and start trading outcomes.</p>
            <DiscordLoginButton />
          </div>
        </aside>
      </section>
    </main>
  );
}
