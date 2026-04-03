'use client';

import { useState } from 'react';

export default function AdminMarketForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage(null);

    const res = await fetch('/api/admin/markets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: form.get('question'),
        description: form.get('description'),
        category: form.get('category'),
        closesAt: form.get('closesAt')
      })
    });

    const data = await res.json();
    setLoading(false);
    setMessage(data.error ?? data.message ?? 'Done');

    if (res.ok) {
      event.currentTarget.reset();
      window.location.reload();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Question
        <input name="question" required placeholder="Will GTA 6 release in 2026?" />
      </label>
      <label>
        Description
        <textarea name="description" rows={4} placeholder="Optional market description and resolution criteria." />
      </label>
      <label>
        Category
        <input name="category" placeholder="Gaming" />
      </label>
      <label>
        Close time
        <input name="closesAt" type="datetime-local" required />
      </label>
      <button className="btn btn-primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create market'}
      </button>
      {message ? <div className="notice">{message}</div> : null}
    </form>
  );
}
