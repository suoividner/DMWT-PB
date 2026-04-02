# Inferno Markets

Polymarket-inspired prediction market built with **Next.js + Supabase + Vercel**.

## Features

- Discord OAuth login (Supabase Auth).
- Fake-money wallet system (new users receive **$1,000**).
- Market feed with YES/NO price display.
- Buy YES/NO positions with play money.
- Portfolio page for balances and trade history.
- Admin backend for creating and resolving bets.

## Setup

1. Create a Supabase project.
2. In Supabase Auth, enable Discord provider and configure redirect URL:
   - `https://YOUR_DOMAIN/auth/callback`
   - for local dev: `http://localhost:3000/auth/callback`
3. Run `sql/schema.sql` in Supabase SQL editor.
4. Add your env vars from `.env.example` into `.env.local`.
5. Install and run:

```bash
npm install
npm run dev
```

## Admin access

Add your user UUID to `admins` table:

```sql
insert into admins (user_id) values ('YOUR_AUTH_USER_UUID');
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import into Vercel.
3. Add the same env vars in Vercel project settings.
4. Set Supabase redirect URL to your Vercel domain `/auth/callback`.

## Notes

- This is fake money only (no real-money rails).
- Current pricing uses a simple pool-ratio model to mimic market movement.
