import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
  
  if (error) return Response.json({ error: error.message }, { status: 500 });

  if (!data) {
    return Response.json({
      settings: {
        id: 1,
        site_name: 'عقاريون المتحدة',
        site_tagline: 'منصة العقارات الفاخرة في مصر',
        site_logo: '',
        whatsapp_number: '201147007061',
        phone_number: '01147007061',
        email: 'info@aqarion.com',
        address: 'القاهرة، التجمع الخامس',
        announcement_text: 'عروض حصرية على فيلل الساحل الشمالي | تواصل الآن',
        announcement_active: true,
        properties_per_page: 6,
        openai_model: 'gpt-4o-mini'
      }
    });
  }
  
  return Response.json({ settings: data });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, updated_at, ...updateData } = body;
    
    // Ensure correct types
    if (updateData.announcement_active !== undefined) {
      updateData.announcement_active = String(updateData.announcement_active) === 'true';
    }
    if (updateData.properties_per_page !== undefined) {
      updateData.properties_per_page = parseInt(updateData.properties_per_page) || 6;
    }

    const { data, error } = await supabase.from('site_settings').upsert({
      id: 1,
      ...updateData,
      updated_at: new Date().toISOString()
    }).select().single();
    
    if (error) throw error;
    return Response.json({ settings: data, success: true });
  } catch (error) {
    console.error('Settings Update Error:', error);
    return Response.json({ error: 'فشل تحديث الإعدادات' }, { status: 500 });
  }
}
