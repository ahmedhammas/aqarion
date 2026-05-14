import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('ads').select('*').order('id', { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ads: data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    // Remove id and created_at if present to let Supabase handle them
    const { id, created_at, ...insertData } = body;
    
    const { data, error } = await supabase.from('ads').insert([{
      ...insertData,
      is_active: true,
      updated_at: new Date().toISOString()
    }]).select().single();
    
    if (error) throw error;
    return Response.json({ ad: data }, { status: 201 });
  } catch (error) {
    console.error('Ads POST Error:', error);
    return Response.json({ error: error.message || 'فشل إضافة الإعلان' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    const { data, error } = await supabase.from('ads').update({
      ...updateData,
      updated_at: new Date().toISOString()
    }).eq('id', id).select().single();
    
    if (error) throw error;
    return Response.json({ ad: data });
  } catch (error) {
    console.error('Ads PUT Error:', error);
    return Response.json({ error: error.message || 'فشل تحديث الإعلان' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return Response.json({ error: 'معرف الإعلان مطلوب' }, { status: 400 });

    const { error } = await supabase.from('ads').delete().eq('id', parseInt(id));
    
    if (error) throw error;
    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Ads DELETE Error:', error);
    return Response.json({ error: error.message || 'فشل حذف الإعلان' }, { status: 500 });
  }
}
