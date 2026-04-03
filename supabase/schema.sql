create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  discord_username text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance_cents integer not null default 100000,
  lifetime_profit_cents integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.markets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  question text not null,
  description text,
  category text,
  image_url text,
  closes_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'resolved', 'closed')),
  outcome text check (outcome in ('yes', 'no')),
  yes_pool_cents integer not null default 5000,
  no_pool_cents integer not null default 5000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  market_id uuid not null references public.markets(id) on delete cascade,
  side text not null check (side in ('yes', 'no')),
  spend_cents integer not null check (spend_cents > 0),
  shares numeric(18,6) not null check (shares > 0),
  price_cents integer not null check (price_cents between 1 and 99),
  created_at timestamptz not null default now()
);

create table if not exists public.user_market_holdings (
  user_id uuid not null references public.profiles(id) on delete cascade,
  market_id uuid not null references public.markets(id) on delete cascade,
  yes_shares numeric(18,6) not null default 0,
  no_shares numeric(18,6) not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, market_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_meta jsonb := new.raw_user_meta_data;
  preferred_name text;
  avatar text;
begin
  preferred_name := coalesce(raw_meta ->> 'preferred_username', raw_meta ->> 'user_name', raw_meta ->> 'full_name', new.email);
  avatar := raw_meta ->> 'avatar_url';

  insert into public.profiles (id, discord_username, avatar_url)
  values (new.id, preferred_name, avatar)
  on conflict (id) do update
  set discord_username = excluded.discord_username,
      avatar_url = excluded.avatar_url;

  insert into public.wallets (user_id, balance_cents)
  values (new.id, 100000)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists wallets_touch_updated_at on public.wallets;
create trigger wallets_touch_updated_at
before update on public.wallets
for each row execute procedure public.touch_updated_at();

drop trigger if exists markets_touch_updated_at on public.markets;
create trigger markets_touch_updated_at
before update on public.markets
for each row execute procedure public.touch_updated_at();

create or replace function public.place_trade(
  p_user_id uuid,
  p_market_id uuid,
  p_side text,
  p_spend_cents integer,
  p_price_cents integer,
  p_shares numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
  v_market public.markets%rowtype;
begin
  if p_side not in ('yes', 'no') then
    raise exception 'Invalid side';
  end if;

  select * into v_market from public.markets where id = p_market_id for update;
  if not found then
    raise exception 'Market not found';
  end if;

  if v_market.status <> 'active' then
    raise exception 'Market is not active';
  end if;

  if v_market.closes_at <= now() then
    raise exception 'Market already closed';
  end if;

  select balance_cents into v_balance from public.wallets where user_id = p_user_id for update;
  if v_balance is null then
    raise exception 'Wallet not found';
  end if;

  if v_balance < p_spend_cents then
    raise exception 'Insufficient funds';
  end if;

  update public.wallets
  set balance_cents = balance_cents - p_spend_cents
  where user_id = p_user_id;

  insert into public.trades (user_id, market_id, side, spend_cents, shares, price_cents)
  values (p_user_id, p_market_id, p_side, p_spend_cents, p_shares, p_price_cents);

  insert into public.user_market_holdings (user_id, market_id, yes_shares, no_shares)
  values (
    p_user_id,
    p_market_id,
    case when p_side = 'yes' then p_shares else 0 end,
    case when p_side = 'no' then p_shares else 0 end
  )
  on conflict (user_id, market_id)
  do update set
    yes_shares = public.user_market_holdings.yes_shares + case when p_side = 'yes' then p_shares else 0 end,
    no_shares = public.user_market_holdings.no_shares + case when p_side = 'no' then p_shares else 0 end,
    updated_at = now();

  update public.markets
  set yes_pool_cents = yes_pool_cents + case when p_side = 'yes' then p_spend_cents else 0 end,
      no_pool_cents = no_pool_cents + case when p_side = 'no' then p_spend_cents else 0 end
  where id = p_market_id;
end;
$$;

create or replace function public.resolve_market(
  p_market_id uuid,
  p_outcome text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  payout_row record;
  already_resolved text;
begin
  if p_outcome not in ('yes', 'no') then
    raise exception 'Invalid outcome';
  end if;

  select status into already_resolved from public.markets where id = p_market_id for update;
  if already_resolved is null then
    raise exception 'Market not found';
  end if;

  if already_resolved = 'resolved' then
    raise exception 'Market already resolved';
  end if;

  update public.markets
  set status = 'resolved',
      outcome = p_outcome,
      updated_at = now()
  where id = p_market_id;

  for payout_row in
    select
      h.user_id,
      case when p_outcome = 'yes' then h.yes_shares else h.no_shares end as winning_shares
    from public.user_market_holdings h
    where h.market_id = p_market_id
  loop
    if payout_row.winning_shares > 0 then
      update public.wallets
      set balance_cents = balance_cents + round(payout_row.winning_shares * 100),
          lifetime_profit_cents = lifetime_profit_cents + round(payout_row.winning_shares * 100)
      where user_id = payout_row.user_id;
    end if;
  end loop;
end;
$$;

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.markets enable row level security;
alter table public.trades enable row level security;
alter table public.user_market_holdings enable row level security;

create policy "Profiles are viewable by signed-in users"
on public.profiles for select
using (auth.uid() is not null);

create policy "Users can view own wallet"
on public.wallets for select
using (auth.uid() = user_id);

create policy "Markets are public readable"
on public.markets for select
using (true);

create policy "Trades are public readable"
on public.trades for select
using (true);

create policy "Users can view own holdings"
on public.user_market_holdings for select
using (auth.uid() = user_id);

grant usage on schema public to anon, authenticated, service_role;
grant select on public.markets to anon, authenticated;
grant select on public.trades to anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.wallets to authenticated;
grant select on public.user_market_holdings to authenticated;
grant execute on function public.place_trade(uuid, uuid, text, integer, integer, numeric) to service_role;
grant execute on function public.resolve_market(uuid, text) to service_role;
