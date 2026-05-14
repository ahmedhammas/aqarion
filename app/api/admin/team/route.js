import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ team: data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('team_members').insert([{
      ...body,
      is_active: true,
      display_order: 0
    }]).select().single();
    
    if (error) throw error;
    return Response.json({ member: data }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'فشل إضافة عضو الفريق' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    const { data, error } = await supabase.from('team_members').update(updateData).eq('id', id).select().single();
    
    if (error) throw error;
    return Response.json({ member: data });
  } catch (error) {
    return Response.json({ error: 'فشل تحديث بيانات العضو' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  
  if (error) return Response.json({ error: 'فشل حذف العضو' }, { status: 500 });
  return Response.json({ success: true });
}
