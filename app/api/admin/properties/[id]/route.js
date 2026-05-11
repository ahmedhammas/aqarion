import { propertiesStore } from '@/lib/admin-store';

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const property = propertiesStore.find(p => p.id === id);
  if (!property) return Response.json({ error: 'العقار غير موجود' }, { status: 404 });
  return Response.json({ property });
}

export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const index = propertiesStore.findIndex(p => p.id === id);
  if (index === -1) return Response.json({ error: 'العقار غير موجود' }, { status: 404 });

  const body = await req.json();
  propertiesStore[index] = { ...propertiesStore[index], ...body, updated_at: new Date().toISOString() };
  return Response.json({ property: propertiesStore[index] });
}

export async function DELETE(req, { params }) {
  const id = parseInt(params.id);
  const index = propertiesStore.findIndex(p => p.id === id);
  if (index === -1) return Response.json({ error: 'العقار غير موجود' }, { status: 404 });

  propertiesStore.splice(index, 1);
  return Response.json({ success: true });
}
