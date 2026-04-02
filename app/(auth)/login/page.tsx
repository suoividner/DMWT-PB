import { DiscordLoginButton } from "@/components/discord-login";

export default function LoginPage() {
  return (
    <main className="container" style={{ maxWidth: 540 }}>
      <section className="card" style={{ textAlign: "center" }}>
        <img src="/logo.svg" alt="Inferno logo" style={{ width: 86, borderRadius: 12 }} />
        <h1>Sign in to Inferno Markets</h1>
        <p style={{ color: "#9ca3af" }}>
          Login with Discord. On your first login we create your profile and deposit <strong>$1,000 fake cash</strong>.
        </p>
        <DiscordLoginButton />
      </section>
    </main>
  );
}
