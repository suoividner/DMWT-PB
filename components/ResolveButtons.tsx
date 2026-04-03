'use client';

import { useState } from 'react';

export default function ResolveButtons({ marketId }: { marketId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function resolve(outcome: 'yes' | 'no') {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/markets/${marketId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome })
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.error ?? data.message ?? 'Done');
    if (res.ok) window.location.reload();
  }

  return (
    <div className="stack">
      <div className="row">
        <button disabled={loading} className="btn btn-primary" onClick={() => resolve('yes')}>Resolve YES</button>
        <button disabled={loading} className="btn btn-secondary" onClick={() => resolve('no')}>Resolve NO</button>
      </div>
      {message ? <div className="notice">{message}</div> : null}
    </div>
  );
}
