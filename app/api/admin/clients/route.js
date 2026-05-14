import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('users').select('*').eq('role', 'user').order('created_at', { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ clients: data });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, full_name, phone, notes, is_active } = body;

    if (!email || !full_name) {
      return Response.json({ error: 'البريد الإلكتروني والاسم مطلوبان' }, { status: 400 });
    }

    const clientRecord = {
      email,
      full_name,
      phone: phone || '',
      role: 'user',
      notes: notes || '',
      is_active: is_active !== undefined ? Boolean(is_active) : true,
    };

    const { data, error } = await supabase.from('users').insert([clientRecord]).select().single();

    if (error) {
      if (error.code === '23505') return Response.json({ error: 'البريد الإلكتروني مسجل بالفعل' }, { status: 409 });
      throw error;
    }

    return Response.json({ client: data }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, created_at, ...updateData } = body;
    
    const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    
    return Response.json({ client: data });
  } catch (error) {
    return Response.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) return Response.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  
  return Response.json({ success: true });
}
