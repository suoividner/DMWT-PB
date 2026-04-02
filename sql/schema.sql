-- Enable UUID generation helper.
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  discord_username text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 1000,
  created_at timestamptz not null default now()
);

create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists markets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  closes_at timestamptz not null,
  resolved_at timestamptz,
  result text check (result in ('yes', 'no')),
  yes_pool integer not null default 1000,
  no_pool integer not null default 1000,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  market_id uuid not null references markets(id) on delete cascade,
  side text not null check (side in ('yes', 'no')),
  shares numeric(14,4) not null,
  cost_basis integer not null,
  payout integer not null default 0,
  is_settled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table wallets enable row level security;
alter table admins enable row level security;
alter table markets enable row level security;
alter table positions enable row level security;

create policy "profiles self read" on profiles for select to authenticated using (auth.uid() = id);
create policy "wallet self read" on wallets for select to authenticated using (auth.uid() = user_id);
create policy "positions self read" on positions for select to authenticated using (auth.uid() = user_id);

create policy "markets public read" on markets for select to authenticated using (true);
create policy "admins self read" on admins for select to authenticated using (auth.uid() = user_id);

create policy "wallet self update" on wallets for update to authenticated using (auth.uid() = user_id);
create policy "positions self insert" on positions for insert to authenticated with check (auth.uid() = user_id);
create policy "market authenticated update" on markets for update to authenticated using (true);
create policy "market authenticated insert" on markets for insert to authenticated with check (true);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, discord_username, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;

  insert into public.wallets (user_id, balance)
  values (new.id, 1000)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
