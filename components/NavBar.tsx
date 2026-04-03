import Image from 'next/image';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/AuthButton';
import { centsToDollars } from '@/lib/utils';

export default async function NavBar() {
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let walletBalance: number | null = null;
  let isAdmin = false;

  if (user) {
    const [{ data: wallet }, { data: profile }] = await Promise.all([
      supabase.from('wallets').select('balance_cents').eq('user_id', user.id).single(),
      supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    ]);

    walletBalance = wallet?.balance_cents ?? null;
    isAdmin = profile?.is_admin ?? false;
  }

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link href="/" className="brand">
          <Image src="/logo.png" alt="DMWT Betting" width={40} height={40} />
          <span>DMWT Betting</span>
        </Link>

        <div className="row">
          <Link href="/" className="btn">Markets</Link>
          {isAdmin ? <Link href="/admin" className="btn">Admin</Link> : null}
          {user && walletBalance !== null ? <span className="badge">Balance: {centsToDollars(walletBalance)}</span> : null}
          {user ? <LogoutButton /> : <Link className="btn btn-primary" href="/login">Sign in</Link>}
        </div>
      </div>
    </header>
  );
}
