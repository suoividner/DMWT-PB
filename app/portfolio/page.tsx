import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const [{ data: wallet }, { data: positions }] = await Promise.all([
    supabase.from("wallets").select("balance").eq("user_id", userData.user.id).single(),
    supabase
      .from("positions")
      .select("id,side,cost_basis,shares,payout,is_settled,market:markets(title)")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
  ]);

  return (
    <main className="container" style={{ maxWidth: 900 }}>
      <section className="card" style={{ marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>Portfolio</h1>
        <p style={{ color: "#9ca3af" }}>Play balance</p>
        <h2 style={{ marginTop: 0 }}>${wallet?.balance ?? 0}</h2>
      </section>

      <section className="card">
        <h3>Your trades</h3>
        <div className="grid">
          {(positions ?? []).map((position) => {
            const marketTitle = position.market?.[0]?.title;

            return (
              <article key={position.id} className="card">
                <strong>{marketTitle ?? "Unknown market"}</strong>
                <p style={{ color: "#9ca3af" }}>{position.side.toUpperCase()} • {position.shares.toFixed(2)} shares • Cost ${position.cost_basis}</p>
                <p style={{ margin: 0 }}>{position.is_settled ? `Settled payout: $${position.payout}` : "Open position"}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
