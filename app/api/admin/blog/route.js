import { blogStore } from '@/lib/admin-store';

export async function GET() {
  const sorted = [...blogStore].sort((a, b) => b.id - a.id);
  return Response.json({ posts: sorted, total: sorted.length });
}

export async function POST(req) {
  const body = await req.json();
  const newId = Math.max(...blogStore.map(p => p.id), 0) + 1;
  const newPost = {
    id: newId,
    slug: body.slug || body.title?.replace(/\s+/g, '-') || `post-${newId}`,
    views_count: 0,
    status: body.status || 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...body,
  };
  blogStore.unshift(newPost);
  return Response.json({ post: newPost }, { status: 201 });
}
