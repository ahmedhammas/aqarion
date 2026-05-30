import { supabase } from '@/lib/supabase';

export async function PUT(req, { params }) {
  const id = params.id;
  const body = await req.json();

  const updateData = { ...body };
  if (body.status === 'replied') {
    updateData.replied_at = new Date().toISOString();
  }

  const { data, error } = await supabase.from('contact_messages').update(updateData).eq('id', id).select().single();
  
  if (error) return Response.json({ error: 'فشل تحديث الرسالة' }, { status: 500 });
  return Response.json({ message: data });
}

export async function DELETE(req, { params }) {
  const id = params.id;
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  
  if (error) return Response.json({ error: 'الرسالة غير موجودة' }, { status: 404 });
  return Response.json({ success: true });
}
