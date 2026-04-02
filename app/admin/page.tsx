import { redirect } from "next/navigation";
import { createMarket, resolveMarket } from "@/app/actions";
import { createClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", userData.user.id).maybeSingle();
  if (!admin) {
    return (
      <main className="container">
        <section className="card">
          <h1>Admin only</h1>
          <p>Add your user UUID to the <code>admins</code> table to access this panel.</p>
        </section>
      </main>
    );
  }

  const { data: markets } = await supabase.from("markets").select("id,title,is_active").order("created_at", { ascending: false });

  return (
    <main className="container" style={{ maxWidth: 960, paddingBottom: "2rem" }}>
      <section className="card" style={{ marginBottom: "1rem" }}>
        <h1>Create market</h1>
        <form action={createMarket} className="grid">
          <input name="title" placeholder="Will ETH be above $5k by Dec 2026?" required />
          <textarea name="description" placeholder="Details and settlement rules" rows={4} required />
          <input name="category" placeholder="Crypto" required />
          <input type="datetime-local" name="closes_at" required />
          <button className="btn">Publish market</button>
        </form>
      </section>

      <section className="card">
        <h2>Resolve markets</h2>
        <div className="grid">
          {(markets ?? []).filter((m) => m.is_active).map((market) => (
            <form key={market.id} action={resolveMarket} className="card">
              <input type="hidden" name="market_id" value={market.id} />
              <strong>{market.title}</strong>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
                <button className="btn btn-green" name="result" value="yes">Resolve YES</button>
                <button className="btn btn-red" name="result" value="no">Resolve NO</button>
              </div>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}
