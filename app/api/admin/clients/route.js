import { clientsStore } from '@/lib/admin-store';

export async function GET() {
  return Response.json({ clients: clientsStore });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, full_name, phone, notes, is_active } = body;

    if (!email || !full_name) {
      return Response.json({ error: 'البريد الإلكتروني والاسم مطلوبان' }, { status: 400 });
    }

    const existing = clientsStore.find(c => c.email === email);
    if (existing) {
      return Response.json({ error: 'البريد الإلكتروني مسجل بالفعل' }, { status: 409 });
    }

    const newClient = {
      id: `client-${Date.now()}`,
      email,
      full_name,
      phone: phone || '',
      role: 'client',
      is_active: is_active !== false,
      notes: notes || '',
      created_at: new Date().toISOString(),
    };

    clientsStore.push(newClient);
    return Response.json({ client: newClient }, { status: 201 });
  } catch {
    return Response.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const index = clientsStore.findIndex(c => c.id === body.id);
    if (index === -1) {
      return Response.json({ error: 'العميل غير موجود' }, { status: 404 });
    }
    clientsStore[index] = { ...clientsStore[index], ...body };
    return Response.json({ client: clientsStore[index] });
  } catch {
    return Response.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const index = clientsStore.findIndex(c => c.id === id);
  if (index === -1) {
    return Response.json({ error: 'العميل غير موجود' }, { status: 404 });
  }
  clientsStore.splice(index, 1);
  return Response.json({ success: true });
}
