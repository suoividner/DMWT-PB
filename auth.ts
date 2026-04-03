:root {
  --bg: #050505;
  --panel: #111111;
  --panel-2: #171717;
  --border: #2a2a2a;
  --text: #f5f5f5;
  --muted: #b3b3b3;
  --brand: #ff2a55;
  --brand-2: #ffb000;
  --green: #2dd4bf;
  --red: #fb7185;
}

* {
  box-sizing: border-box;
}

html {
  color-scheme: dark;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background:
    radial-gradient(circle at top, rgba(255, 42, 85, 0.13), transparent 30%),
    radial-gradient(circle at bottom right, rgba(255, 176, 0, 0.14), transparent 26%),
    var(--bg);
  color: var(--text);
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
}

.container {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(14px);
  background: rgba(5, 5, 5, 0.82);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.brand img {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
}

.row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.page {
  padding: 28px 0 48px;
}

.panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.25);
}

.hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
  margin-bottom: 28px;
}

.muted {
  color: var(--muted);
}

.grid {
  display: grid;
  gap: 16px;
}

.market-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.market-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.market-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.06);
  font-size: 0.85rem;
}

.btn {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.06);
  color: var(--text);
  border-radius: 14px;
  padding: 10px 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  border-color: rgba(255,255,255,0.18);
}

.btn-primary {
  background: linear-gradient(90deg, var(--brand), #ff5f2a);
  border-color: transparent;
}

.btn-secondary {
  background: linear-gradient(90deg, #ef4444, #f59e0b);
  border-color: transparent;
}

.price-pill {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 16px;
  font-weight: 700;
}

.yes {
  background: rgba(45, 212, 191, 0.12);
  border: 1px solid rgba(45, 212, 191, 0.35);
  color: #8ef3e1;
}

.no {
  background: rgba(251, 113, 133, 0.12);
  border: 1px solid rgba(251, 113, 133, 0.35);
  color: #ff9fb1;
}

form {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 0.95rem;
}

input,
textarea,
select {
  width: 100%;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  padding: 12px 14px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.kpi {
  font-size: 2rem;
  font-weight: 800;
}

.split {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
}

.stack {
  display: grid;
  gap: 14px;
}

.notice {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px dashed rgba(255,255,255,0.12);
}

@media (max-width: 900px) {
  .hero,
  .split {
    grid-template-columns: 1fr;
  }
}
