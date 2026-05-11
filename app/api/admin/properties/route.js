import { supabase } from '@/lib/supabase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');

  let query = supabase.from('properties').select('*', { count: 'exact' });

  if (city) query = query.eq('city', city);
  if (type) query = query.eq('typeLabel', type);
  if (status) query = query.eq('status', status);
  if (featured === 'true') query = query.eq('featured', true);
  if (search) query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);

  switch (sort) {
    case 'cheapest': query = query.order('priceNum', { ascending: true }); break;
    case 'expensive': query = query.order('priceNum', { ascending: false }); break;
    case 'views': query = query.order('views_count', { ascending: false }); break;
    default: query = query.order('id', { ascending: false });
  }

  const { data, count, error } = await query.range((page - 1) * perPage, page * perPage - 1);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const totalPages = Math.ceil((count || 0) / perPage);

  return Response.json({ properties: data, total: count, totalPages, page });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const slug = body.name?.replace(/\s+/g, '-') || `property-${Date.now()}`;
    
    const { data, error } = await supabase.from('properties').insert([{
      ...body,
      slug,
      views_count: 0,
      is_published: true,
    }]).select().single();

    if (error) throw error;

    return Response.json({ property: data }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'فشل إضافة العقار' }, { status: 500 });
  }
}
