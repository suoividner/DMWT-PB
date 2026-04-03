# DMWT Markets (Fresh Start)

This project has been reset to a simple, polished MVP.

## What it includes

- A clean landing page inspired by Polymarket's visual style
- A demo market card with perpetually fluctuating YES/NO odds animation
- A **Log in with Discord** button on the right side of the landing page (demo auth simulation)
- Redirect to `/bets` after sign in
- A protected active bets page showing currently active markets

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Authentication is currently simulated with `localStorage` for rapid prototyping.
- Next step can be wiring real Discord OAuth and a backend market store.
