import Link from 'next/link';
import { Market } from '@/lib/types';
import { formatDate, getNoPriceCents, getYesPriceCents } from '@/lib/utils';

export default function MarketCard({ market }: { market: Market }) {
  const yes = getYesPriceCents(market);
  const no = getNoPriceCents(market);

  return (
    <Link href={`/market/${market.id}`} className="panel market-card">
      <div className="market-meta">
        <span className="badge">{market.category ?? 'General'}</span>
        <span className="badge">{market.status.toUpperCase()}</span>
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px' }}>{market.question}</h3>
        <p className="muted" style={{ margin: 0 }}>
          Closes {formatDate(market.closes_at)}
        </p>
      </div>
      <div className="row">
        <span className="price-pill yes">YES {yes}¢</span>
        <span className="price-pill no">NO {no}¢</span>
      </div>
    </Link>
  );
}
