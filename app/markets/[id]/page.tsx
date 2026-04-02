import { notFound } from "next/navigation";
import { placeTrade } from "@/app/actions";
import { createClient } from "@/lib/supabase-server";

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: market } = await supabase.from("markets").select("*").eq("id", id).single();

  if (!market) notFound();

  const yesPrice = market.yes_pool / (market.yes_pool + market.no_pool);

  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <article className="card">
        <p style={{ color: "#9ca3af" }}>{market.category}</p>
        <h1>{market.title}</h1>
        <p>{market.description}</p>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div className="card" style={{ flex: 1 }}>
            <strong style={{ color: "#14f195" }}>YES {(yesPrice * 100).toFixed(1)}¢</strong>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <strong style={{ color: "#ff5b7f" }}>NO {((1 - yesPrice) * 100).toFixed(1)}¢</strong>
          </div>
        </div>

        {market.is_active ? (
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <form action={placeTrade} className="card" style={{ background: "rgba(20, 241, 149, 0.1)" }}>
              <input type="hidden" name="market_id" value={market.id} />
              <input type="hidden" name="side" value="yes" />
              <label>Amount of fake money ($)</label>
              <input type="number" name="amount" min={1} defaultValue={20} />
              <button className="btn btn-green" style={{ width: "100%", marginTop: "0.6rem" }}>Buy YES</button>
            </form>

            <form action={placeTrade} className="card" style={{ background: "rgba(255, 91, 127, 0.08)" }}>
              <input type="hidden" name="market_id" value={market.id} />
              <input type="hidden" name="side" value="no" />
              <label>Amount of fake money ($)</label>
              <input type="number" name="amount" min={1} defaultValue={20} />
              <button className="btn btn-red" style={{ width: "100%", marginTop: "0.6rem" }}>Buy NO</button>
            </form>
          </div>
        ) : (
          <p><strong>Resolved:</strong> {market.result?.toUpperCase()}</p>
        )}
      </article>
    </main>
  );
}
