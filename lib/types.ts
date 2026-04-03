export type MarketStatus = 'active' | 'resolved' | 'closed';
export type MarketOutcome = 'yes' | 'no' | null;

export type Profile = {
  id: string;
  discord_username: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Wallet = {
  user_id: string;
  balance_cents: number;
  lifetime_profit_cents: number;
};

export type Market = {
  id: string;
  slug: string;
  question: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  closes_at: string;
  status: MarketStatus;
  outcome: MarketOutcome;
  yes_pool_cents: number;
  no_pool_cents: number;
  created_at: string;
};

export type TradeSide = 'yes' | 'no';

export type Trade = {
  id: string;
  user_id: string;
  market_id: string;
  side: TradeSide;
  spend_cents: number;
  shares: number;
  price_cents: number;
  created_at: string;
};

export type Holding = {
  market_id: string;
  yes_shares: number;
  no_shares: number;
};
