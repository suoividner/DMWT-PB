import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { SignOutButton } from "./signout-button";

export async function Navbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <header style={{ borderBottom: "1px solid #222", marginBottom: "1.5rem" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 0" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src="/logo.svg" alt="Inferno Markets" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <strong>Inferno Markets</strong>
        </Link>
        <nav style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
          <Link className="btn" href="/">Markets</Link>
          {data.user ? (
            <>
              <Link className="btn" href="/portfolio">Portfolio</Link>
              <Link className="btn" href="/admin">Admin</Link>
              <SignOutButton />
            </>
          ) : (
            <Link className="btn" href="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
