import { blogStore } from '@/lib/admin-store';

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const post = blogStore.find(p => p.id === id);
  if (!post) return Response.json({ error: 'المقال غير موجود' }, { status: 404 });
  return Response.json({ post });
}

export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const index = blogStore.findIndex(p => p.id === id);
  if (index === -1) return Response.json({ error: 'المقال غير موجود' }, { status: 404 });
  const body = await req.json();
  blogStore[index] = { ...blogStore[index], ...body, updated_at: new Date().toISOString() };
  return Response.json({ post: blogStore[index] });
}

export async function DELETE(req, { params }) {
  const id = parseInt(params.id);
  const index = blogStore.findIndex(p => p.id === id);
  if (index === -1) return Response.json({ error: 'المقال غير موجود' }, { status: 404 });
  blogStore.splice(index, 1);
  return Response.json({ success: true });
}
