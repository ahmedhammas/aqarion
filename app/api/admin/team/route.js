import { teamStore } from '@/lib/admin-store';

export async function GET() {
  const sorted = [...teamStore].sort((a, b) => a.display_order - b.display_order);
  return Response.json({ team: sorted });
}

export async function POST(req) {
  const body = await req.json();
  const newId = Math.max(...teamStore.map(t => t.id), 0) + 1;
  const newMember = { id: newId, is_active: true, display_order: teamStore.length, created_at: new Date().toISOString(), ...body };
  teamStore.push(newMember);
  return Response.json({ member: newMember }, { status: 201 });
}

export async function PUT(req) {
  const body = await req.json();
  const index = teamStore.findIndex(t => t.id === body.id);
  if (index === -1) return Response.json({ error: 'غير موجود' }, { status: 404 });
  teamStore[index] = { ...teamStore[index], ...body };
  return Response.json({ member: teamStore[index] });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'));
  const index = teamStore.findIndex(t => t.id === id);
  if (index === -1) return Response.json({ error: 'غير موجود' }, { status: 404 });
  teamStore.splice(index, 1);
  return Response.json({ success: true });
}
