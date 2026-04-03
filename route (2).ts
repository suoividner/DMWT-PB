import { LoginButton } from '@/components/AuthButton';

export default function LoginPage() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 540 }}>
        <div className="panel stack">
          <span className="badge">Discord authentication</span>
          <h1 style={{ margin: 0 }}>Sign in to start betting</h1>
          <p className="muted" style={{ margin: 0 }}>
            Your Discord account becomes your unique identity on the site. On your first sign in, the database trigger creates your profile, wallet, and starting bankroll.
          </p>
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
