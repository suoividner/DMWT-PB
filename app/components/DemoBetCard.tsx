'use client';

import { useEffect, useState } from 'react';

export function DemoBetCard() {
  const [yesOdds, setYesOdds] = useState(61);
  const [resultText, setResultText] = useState('Simulating market moves...');

  useEffect(() => {
    const id = setInterval(() => {
      setYesOdds((prev) => {
        const swing = Math.round((Math.random() - 0.5) * 8);
        const next = Math.min(88, Math.max(12, prev + swing));
        const direction = next > prev ? 'YES momentum rising' : next < prev ? 'NO side pressuring' : 'Holding near fair value';
        setResultText(direction);
        return next;
      });
    }, 1400);

    return () => clearInterval(id);
  }, []);

  const noOdds = 100 - yesOdds;

  return (
    <article className="demo-card">
      <p className="demo-label">Demo Bet</p>
      <h2>Will Ethereum close above $4,000 by June 30?</h2>
      <div className="odds-row">
        <div className="odds-pill yes">
          <span>YES</span>
          <strong>{yesOdds}%</strong>
        </div>
        <div className="odds-pill no">
          <span>NO</span>
          <strong>{noOdds}%</strong>
        </div>
      </div>
      <p className="sim-result">{resultText}</p>
    </article>
  );
}
