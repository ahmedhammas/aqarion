import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, count, error } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('id', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ posts: data, total: count });
}

export async function POST(req) {
  const body = await req.json();
  const slug = body.slug || body.title?.replace(/\s+/g, '-') || `post-${Date.now()}`;
  
  const { data, error } = await supabase.from('blog_posts').insert([{
    ...body,
    slug,
    views_count: 0,
    status: body.status || 'published',
  }]).select().single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ post: data }, { status: 201 });
}
