import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ team: data });
}

export async function POST(req) {
  const body = await req.json();
  
  const { data, error } = await supabase.from('team').insert([{
    ...body,
    is_active: true,
  }]).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ member: data }, { status: 201 });
}

export async function PUT(req) {
  const body = await req.json();
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('team')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return Response.json({ error: 'غير موجود' }, { status: 404 });
  return Response.json({ member: data });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'));
  
  const { error } = await supabase.from('team').delete().eq('id', id);
  if (error) return Response.json({ error: 'غير موجود' }, { status: 404 });

  return Response.json({ success: true });
}
