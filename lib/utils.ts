import { Market } from '@/lib/types';

export function centsToDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export function getYesPriceCents(market: Pick<Market, 'yes_pool_cents' | 'no_pool_cents'>) {
  const total = market.yes_pool_cents + market.no_pool_cents;
  if (!total) return 50;
  return Math.max(1, Math.min(99, Math.round((market.yes_pool_cents / total) * 100)));
}

export function getNoPriceCents(market: Pick<Market, 'yes_pool_cents' | 'no_pool_cents'>) {
  return 100 - getYesPriceCents(market);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
