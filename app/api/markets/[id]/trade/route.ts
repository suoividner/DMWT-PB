import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getNoPriceCents, getYesPriceCents } from '@/lib/utils';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });

  const body = await request.json();
  const side = body.side === 'no' ? 'no' : 'yes';
  const amountDollars = Number(body.amountDollars);
  const spendCents = Math.round(amountDollars * 100);

  if (!Number.isFinite(amountDollars) || spendCents < 100) {
    return NextResponse.json({ error: 'Minimum trade is $1.' }, { status: 400 });
  }

  const service = createServiceClient();
  const [{ data: market }, { data: wallet }] = await Promise.all([
    service.from('markets').select('*').eq('id', id).single(),
    service.from('wallets').select('*').eq('user_id', user.id).single()
  ]);

  if (!market) return NextResponse.json({ error: 'Market not found.' }, { status: 404 });
  if (!wallet) return NextResponse.json({ error: 'Wallet not found.' }, { status: 404 });
  if (market.status !== 'active') return NextResponse.json({ error: 'Market is not active.' }, { status: 400 });
  if (new Date(market.closes_at).getTime() <= Date.now()) {
    return NextResponse.json({ error: 'This market is already closed for trading.' }, { status: 400 });
  }
  if (wallet.balance_cents < spendCents) {
    return NextResponse.json({ error: 'Insufficient fake funds.' }, { status: 400 });
  }

  const priceCents = side === 'yes' ? getYesPriceCents(market) : getNoPriceCents(market);
  const shares = spendCents / priceCents;

  const { error } = await service.rpc('place_trade', {
    p_user_id: user.id,
    p_market_id: id,
    p_side: side,
    p_spend_cents: spendCents,
    p_price_cents: priceCents,
    p_shares: shares
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: `Bought ${shares.toFixed(2)} ${side.toUpperCase()} shares.` });
}
