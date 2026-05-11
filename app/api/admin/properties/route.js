import { propertiesStore } from '@/lib/admin-store';

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

  let result = [...propertiesStore];

  if (city) result = result.filter(p => p.city === city);
  if (type) result = result.filter(p => p.typeLabel === type);
  if (status) result = result.filter(p => p.status === status);
  if (featured === 'true') result = result.filter(p => p.featured);
  if (search) result = result.filter(p => p.name.includes(search) || p.location.includes(search));

  switch (sort) {
    case 'cheapest': result.sort((a, b) => a.priceNum - b.priceNum); break;
    case 'expensive': result.sort((a, b) => b.priceNum - a.priceNum); break;
    case 'views': result.sort((a, b) => (b.views_count || 0) - (a.views_count || 0)); break;
    default: result.sort((a, b) => b.id - a.id);
  }

  const total = result.length;
  const totalPages = Math.ceil(total / perPage);
  const paginated = result.slice((page - 1) * perPage, page * perPage);

  return Response.json({ properties: paginated, total, totalPages, page });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newId = Math.max(...propertiesStore.map(p => p.id), 0) + 1;
    const newProperty = {
      id: newId,
      slug: body.name?.replace(/\s+/g, '-') || `property-${newId}`,
      views_count: 0,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };
    propertiesStore.unshift(newProperty);
    return Response.json({ property: newProperty }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'فشل إضافة العقار' }, { status: 500 });
  }
}
