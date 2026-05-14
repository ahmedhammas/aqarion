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

  // We alias the fields here so the Frontend receives what it expects (camelCase)
  let query = supabase.from('properties').select(`
    *,
    priceNum:price_num,
    price:price_display,
    typeLabel:type_label,
    listingType:listing_type,
    image:main_image
  `, { count: 'exact' });

  if (city) query = query.eq('city', city);
  if (type) query = query.eq('type_label', type);
  if (status) query = query.eq('status', status);
  if (featured === 'true') query = query.eq('featured', true);
  if (search) query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);

  switch (sort) {
    case 'cheapest': query = query.order('price_num', { ascending: true }); break;
    case 'expensive': query = query.order('price_num', { ascending: false }); break;
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
    
    // STRICT MAPPING to prevent DB errors from extra fields
    const newProperty = {
      name: body.name,
      name_en: body.name_en || null,
      slug: body.name?.replace(/\s+/g, '-') || `property-${Date.now()}`,
      location: body.location,
      city: body.city,
      district: body.district || null,
      price_num: parseInt(body.priceNum || body.price_num || 0),
      price_display: body.priceDisplay || body.price_display || body.price || '',
      currency: body.currency || 'EGP',
      bedrooms: parseInt(body.bedrooms || 0),
      bathrooms: parseInt(body.bathrooms || 0),
      area: parseFloat(body.area || 0),
      land_area: parseFloat(body.land_area || 0),
      floor: parseInt(body.floor || 0),
      total_floors: parseInt(body.total_floors || 0),
      year_built: parseInt(body.year_built || 0),
      type: body.type || 'residential',
      type_label: body.typeLabel || body.type_label || '',
      listing_type: body.listingType || body.listing_type || 'sale',
      status: body.status || 'available',
      featured: body.featured === true,
      tag: body.tag || '',
      description: body.description || '',
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      images: Array.isArray(body.images) ? body.images : [],
      main_image: body.image || body.main_image || '',
      video_url: body.video_url || '',
      virtual_tour_url: body.virtual_tour_url || '',
      is_published: true,
      views_count: 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('properties').insert([newProperty]).select().single();

    if (error) throw error;
    
    return Response.json({ property: data }, { status: 201 });
  } catch (error) {
    console.error('Supabase insert error:', error);
    return Response.json({ error: 'فشل إضافة العقار: ' + (error.message || '') }, { status: 500 });
  }
}
