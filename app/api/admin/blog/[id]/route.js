import { supabase } from '@/lib/supabase';

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
  
  if (error || !data) return Response.json({ error: 'المقال غير موجود' }, { status: 404 });
  return Response.json({ post: data });
}

export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const body = await req.json();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return Response.json({ error: 'المقال غير موجود' }, { status: 404 });
  return Response.json({ post: data });
}

export async function DELETE(req, { params }) {
  const id = parseInt(params.id);
  
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return Response.json({ error: 'المقال غير موجود' }, { status: 404 });

  return Response.json({ success: true });
}
