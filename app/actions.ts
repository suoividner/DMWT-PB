"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

const parseAmount = (value: FormDataEntryValue | null) => {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? Math.max(1, Math.floor(amount)) : 1;
};

export async function createMarket(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { data: isAdmin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user?.id)
    .maybeSingle();

  if (!isAdmin) {
    throw new Error("Not authorized");
  }

  await supabase.from("markets").insert({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? "General"),
    closes_at: String(formData.get("closes_at") ?? new Date().toISOString()),
    yes_pool: 1000,
    no_pool: 1000,
    is_active: true
  });

  revalidatePath("/");
  redirect("/admin");
}

export async function placeTrade(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const marketId = String(formData.get("market_id"));
  const side = String(formData.get("side")) as "yes" | "no";
  const amount = parseAmount(formData.get("amount"));

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", userData.user.id)
    .single();

  if (!wallet || wallet.balance < amount) {
    throw new Error("Insufficient fake balance");
  }

  const { data: market } = await supabase.from("markets").select("yes_pool,no_pool").eq("id", marketId).single();
  if (!market) throw new Error("Market not found");

  const yesPrice = market.yes_pool / (market.yes_pool + market.no_pool);
  const sharePrice = side === "yes" ? yesPrice : 1 - yesPrice;
  const shares = Number((amount / Math.max(0.01, sharePrice)).toFixed(4));

  await supabase.from("wallets").update({ balance: wallet.balance - amount }).eq("user_id", userData.user.id);

  await supabase.from("positions").insert({
    user_id: userData.user.id,
    market_id: marketId,
    side,
    cost_basis: amount,
    shares
  });

  if (side === "yes") {
    await supabase.from("markets").update({ yes_pool: market.yes_pool + amount }).eq("id", marketId);
  } else {
    await supabase.from("markets").update({ no_pool: market.no_pool + amount }).eq("id", marketId);
  }

  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/");
  revalidatePath("/portfolio");
}

export async function resolveMarket(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const marketId = String(formData.get("market_id"));
  const result = String(formData.get("result")) as "yes" | "no";

  const { data: isAdmin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user?.id)
    .maybeSingle();

  if (!isAdmin) throw new Error("Not authorized");

  await supabase
    .from("markets")
    .update({ is_active: false, result, resolved_at: new Date().toISOString() })
    .eq("id", marketId);

  const { data: positions } = await supabase
    .from("positions")
    .select("id,user_id,side,shares")
    .eq("market_id", marketId)
    .eq("is_settled", false);

  for (const position of positions ?? []) {
    const payout = position.side === result ? Math.round(position.shares) : 0;
    const { data: wallet } = await supabase.from("wallets").select("balance").eq("user_id", position.user_id).single();
    if (wallet) {
      await supabase.from("wallets").update({ balance: wallet.balance + payout }).eq("user_id", position.user_id);
    }

    await supabase.from("positions").update({ is_settled: true, payout }).eq("id", position.id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/markets/${marketId}`);
}
