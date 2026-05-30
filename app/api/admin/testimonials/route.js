import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('testimonials').select('*').order('id', { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ testimonials: data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('testimonials').insert([{
      ...body,
      is_published: true,
      is_featured: false,
      rating: body.rating || 5
    }]).select().single();
    
    if (error) throw error;
    return Response.json({ testimonial: data }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'فشل إضافة التقييم' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    const { data, error } = await supabase.from('testimonials').update(updateData).eq('id', id).select().single();
    
    if (error) throw error;
    return Response.json({ testimonial: data });
  } catch (error) {
    return Response.json({ error: 'فشل تحديث التقييم' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  
  if (error) return Response.json({ error: 'فشل حذف التقييم' }, { status: 500 });
  return Response.json({ success: true });
}
