import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, count, error } = await supabase.from('blog_posts').select('*, image:cover_image', { count: 'exact' }).order('id', { ascending: false });
  
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ posts: data, total: count });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newPost = {
      ...body,
      slug: body.slug || body.title?.replace(/\s+/g, '-') || `post-${Date.now()}`,
      views_count: 0,
      status: body.status || 'published',
      updated_at: new Date().toISOString(),
    };

    // Map fields to DB schema
    if (newPost.image) {
      newPost.cover_image = newPost.image;
      delete newPost.image;
    }

    const { data, error } = await supabase.from('blog_posts').insert([newPost]).select().single();
    
    if (error) throw error;
    return Response.json({ post: data }, { status: 201 });
  } catch (error) {
    console.error('Blog post insert error:', error);
    return Response.json({ error: 'فشل إضافة المقال' }, { status: 500 });
  }
}
