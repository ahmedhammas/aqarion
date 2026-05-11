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

  let query = supabase.from('properties').select('*, priceNum:pricenum, typeLabel:typelabel, listingType:listingtype', { count: 'exact' });

  if (city) query = query.eq('city', city);
  if (type) query = query.eq('typelabel', type);
  if (status) query = query.eq('status', status);
  if (featured === 'true') query = query.eq('featured', true);
  if (search) query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);

  switch (sort) {
    case 'cheapest': query = query.order('pricenum', { ascending: true }); break;
    case 'expensive': query = query.order('pricenum', { ascending: false }); break;
    case 'views': query = query.order('views_count', { ascending: false }); break;
    default: query = query.order('id', { ascending: false });
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  const totalPages = Math.ceil((count || 0) / perPage);

  return Response.json({ properties: data, total: count, totalPages, page });
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    const newProperty = {
      ...body,
      slug: body.name?.replace(/\s+/g, '-') || `property-${Date.now()}`,
      views_count: 0,
      is_published: true,
      updated_at: new Date().toISOString(),
    };

    // Rename fields to match DB exactly if needed
    if (newProperty.priceNum) {
      newProperty.pricenum = newProperty.priceNum;
      delete newProperty.priceNum;
    }
    if (newProperty.typeLabel) {
      newProperty.typelabel = newProperty.typeLabel;
      delete newProperty.typeLabel;
    }
    if (newProperty.listingType) {
      newProperty.listingtype = newProperty.listingType;
      delete newProperty.listingType;
    }

    const { data, error } = await supabase.from('properties').insert([newProperty]).select().single();

    if (error) throw error;
    
    return Response.json({ property: data }, { status: 201 });
  } catch (error) {
    console.error('Supabase insert error:', error);
    return Response.json({ error: 'فشل إضافة العقار' }, { status: 500 });
  }
}
