'use client';

import { useState } from 'react';

export default function TradeForm({ marketId }: { marketId: string }) {
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState('10');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch(`/api/markets/${marketId}/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ side, amountDollars: Number(amount) })
    });

    const data = await res.json();
    setLoading(false);
    setMessage(data.error ?? data.message ?? 'Trade submitted.');

    if (res.ok) {
      window.location.reload();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Side
        <select value={side} onChange={(e) => setSide(e.target.value as 'yes' | 'no')}>
          <option value="yes">YES</option>
          <option value="no">NO</option>
        </select>
      </label>
      <label>
        Spend amount ($)
        <input type="number" min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <button className="btn btn-primary" disabled={loading}>
        {loading ? 'Processing...' : 'Buy shares'}
      </button>
      {message ? <div className="notice">{message}</div> : null}
    </form>
  );
}
