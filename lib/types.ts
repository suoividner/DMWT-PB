export type Market = {
  id: string;
  title: string;
  description: string;
  category: string;
  closes_at: string;
  resolved_at: string | null;
  result: "yes" | "no" | null;
  yes_pool: number;
  no_pool: number;
  is_active: boolean;
};
