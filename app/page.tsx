import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: markets } = await supabase
    .from("markets")
    .select("id,title,description,category,yes_pool,no_pool,closes_at,is_active")
    .order("created_at", { ascending: false });

  return (
    <main className="container" style={{ paddingBottom: "2rem" }}>
      <h1 style={{ fontSize: "1.7rem", marginBottom: "1rem" }}>Live prediction markets</h1>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
        {(markets ?? []).map((market) => {
          const yesPrice = market.yes_pool / (market.yes_pool + market.no_pool);
          return (
            <Link className="card" key={market.id} href={`/markets/${market.id}`}>
              <p style={{ color: "#9ca3af", margin: 0 }}>{market.category}</p>
              <h2 style={{ marginTop: "0.4rem", marginBottom: "0.65rem" }}>{market.title}</h2>
              <p style={{ color: "#b8b8b8", minHeight: 46 }}>{market.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#14f195" }}>YES {(yesPrice * 100).toFixed(1)}¢</strong>
                <strong style={{ color: "#ff5b7f" }}>NO {((1 - yesPrice) * 100).toFixed(1)}¢</strong>
              </div>
              <p style={{ marginBottom: 0, color: "#9ca3af" }}>{market.is_active ? `Closes ${new Date(market.closes_at).toLocaleString()}` : "Resolved"}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
