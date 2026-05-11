import { messagesStore } from '@/lib/admin-store';

export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const index = messagesStore.findIndex(m => m.id === id);
  if (index === -1) return Response.json({ error: 'الرسالة غير موجودة' }, { status: 404 });

  const body = await req.json();
  messagesStore[index] = { ...messagesStore[index], ...body };
  if (body.status === 'replied') {
    messagesStore[index].replied_at = new Date().toISOString();
  }
  return Response.json({ message: messagesStore[index] });
}

export async function DELETE(req, { params }) {
  const id = parseInt(params.id);
  const index = messagesStore.findIndex(m => m.id === id);
  if (index === -1) return Response.json({ error: 'الرسالة غير موجودة' }, { status: 404 });
  messagesStore.splice(index, 1);
  return Response.json({ success: true });
}
