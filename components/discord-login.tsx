"use client";

import { createClient } from "@/lib/supabase-browser";

export function DiscordLoginButton() {
  return (
    <button
      className="btn"
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
          provider: "discord",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
      }}
    >
      Continue with Discord
    </button>
  );
}
