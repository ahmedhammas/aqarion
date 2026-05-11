import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ settings: data });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    // Remove ID to prevent accidental update
    const { id, ...updateData } = body;
    
    // Ensure correct types for Database
    if (updateData.announcement_active !== undefined) {
      updateData.announcement_active = String(updateData.announcement_active) === 'true';
    }
    if (updateData.properties_per_page !== undefined) {
      updateData.properties_per_page = parseInt(updateData.properties_per_page) || 6;
    }

    const { data, error } = await supabase.from('site_settings').update({
      ...updateData,
      updated_at: new Date().toISOString()
    }).eq('id', 1).select().single();
    
    if (error) throw error;
    return Response.json({ settings: data, success: true });
  } catch (error) {
    return Response.json({ error: 'فشل تحديث الإعدادات' }, { status: 500 });
  }
}
