# DMWT Betting

A Polymarket-inspired fake-money prediction market app built for **Next.js + Vercel + Supabase**.

## What is included

- Discord login through Supabase Auth
- Auto-created user profile and wallet on first sign-in
- Starting bankroll of **$1,000** fake money for every new user
- Market list page with YES/NO pricing
- Market detail page with trade form and recent activity
- Admin dashboard for creating and resolving markets
- Wallet updates, holdings, and simple market pricing engine
- SQL schema, RLS policies, triggers, and RPC functions

## Important note

This is a **strong MVP** inspired by Polymarket's feel and workflow. It is not a full 1:1 clone of Polymarket's production exchange, matching engine, or legal/compliance stack. The pricing model here is intentionally simpler so you can self-host and keep iterating quickly.

## Stack

- Next.js App Router
- TypeScript
- Supabase Auth / Postgres / RLS / RPC
- Vercel deployment

## Setup

### 1) Create a Supabase project

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2) Configure Discord Auth in Supabase

In Supabase Auth:

- Enable the **Discord** provider
- Add your Discord client ID and secret
- Set redirect URL to:

`https://YOUR_DOMAIN/auth/callback`

For local dev, also add:

`http://localhost:3000/auth/callback`

### 3) Run the SQL

Open the Supabase SQL editor and run the contents of:

- `supabase/schema.sql`

That will create:

- profiles
- wallets
- markets
- trades
- user_market_holdings
- triggers / RLS / helper functions / settlement RPCs

### 4) Make yourself admin

After you sign in once, run this in Supabase SQL editor and replace the user id:

```sql
update public.profiles
set is_admin = true
where id = 'YOUR_AUTH_USER_ID';
```

### 5) Install and run locally

```bash
npm install
npm run dev
```

## How trading works

This build uses a simplified pool-based YES/NO pricing model:

- Every new market starts with equal liquidity on both sides
- YES price is derived from the ratio of the YES pool to the total pool
- NO price is the inverse
- Buying shares moves the relevant pool and stores the user's share balance
- When the market resolves, winning shares pay out **$1.00 per share**

That makes it simple, fun, and easy to understand for a private fake-money game.

## Suggested next upgrades

- Leaderboards
- Comments / reactions under markets
- Limit orders instead of market buys only
- Richer chart history
- Market categories and filtering UI
- Friends feed / notifications
- Trade sell flow / cash out before resolution
- Better admin audit logging
- Discord bot notifications for new markets and resolutions
- Daily / weekly competitions

## Deploying to Vercel

1. Push this folder to GitHub
2. Import the repo in Vercel
3. Add the same environment variables from `.env.local`
4. Deploy
5. Add your Vercel domain to Supabase Auth redirect URLs

## Project structure

- `app/` - pages and API routes
- `components/` - UI pieces
- `lib/` - auth, Supabase, utilities
- `supabase/schema.sql` - full database setup
- `public/logo.png` - your uploaded logo
