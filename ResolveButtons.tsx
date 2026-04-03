import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const question = String(body.question ?? '').trim();
  const description = String(body.description ?? '').trim() || null;
  const category = String(body.category ?? '').trim() || null;
  const closesAt = String(body.closesAt ?? '').trim();

  if (!question || !closesAt) {
    return NextResponse.json({ error: 'Question and close time are required.' }, { status: 400 });
  }

  const service = createServiceClient();
  const { error } = await service.from('markets').insert({
    question,
    slug: slugify(question),
    description,
    category,
    closes_at: new Date(closesAt).toISOString(),
    status: 'active',
    yes_pool_cents: 5000,
    no_pool_cents: 5000
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: 'Market created.' });
}
