import { adsStore } from '@/lib/admin-store';

export async function GET() {
  return Response.json({ ads: adsStore });
}

export async function POST(req) {
  const body = await req.json();
  const newId = Math.max(...adsStore.map(a => a.id), 0) + 1;
  const newAd = {
    id: newId,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...body
  };
  adsStore.push(newAd);
  return Response.json({ ad: newAd }, { status: 201 });
}

export async function PUT(req) {
  const body = await req.json();
  const index = adsStore.findIndex(a => a.id === body.id);
  if (index === -1) return Response.json({ error: 'غير موجود' }, { status: 404 });

  adsStore[index] = {
    ...adsStore[index],
    ...body,
    updated_at: new Date().toISOString()
  };
  return Response.json({ ad: adsStore[index] });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'));
  const index = adsStore.findIndex(a => a.id === id);
  if (index === -1) return Response.json({ error: 'غير موجود' }, { status: 404 });

  adsStore.splice(index, 1);
  return Response.json({ success: true });
}
