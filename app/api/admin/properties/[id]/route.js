import { supabase } from '@/lib/supabase';

export async function GET(req, { params }) {
  const id = params.id;
  const { data, error } = await supabase.from('properties').select(`
    *,
    priceNum:price_num,
    price:price_display,
    typeLabel:type_label,
    listingType:listing_type,
    image:main_image
  `).eq('id', id).single();
  
  if (error || !data) return Response.json({ error: 'العقار غير موجود' }, { status: 404 });
  return Response.json({ property: data });
}

export async function PUT(req, { params }) {
  const id = params.id;
  try {
    const body = await req.json();

    const updateData = { ...body, updated_at: new Date().toISOString() };
    
    // STRICT MAPPING for PUT
    if (updateData.priceNum) { updateData.price_num = updateData.priceNum; delete updateData.priceNum; }
    if (updateData.priceDisplay) { updateData.price_display = updateData.priceDisplay; delete updateData.priceDisplay; }
    if (updateData.typeLabel) { updateData.type_label = updateData.typeLabel; delete updateData.typeLabel; }
    if (updateData.listingType) { updateData.listing_type = updateData.listingType; delete updateData.listingType; }
    if (updateData.image) { updateData.main_image = updateData.image; delete updateData.image; }

    const { data, error } = await supabase.from('properties').update(updateData).eq('id', id).select().single();
    
    if (error) throw error;
    return Response.json({ property: data });
  } catch (error) {
    return Response.json({ error: 'فشل تحديث العقار: ' + (error.message || '') }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const id = params.id;
  const { error } = await supabase.from('properties').delete().eq('id', id);
  
  if (error) return Response.json({ error: 'فشل حذف العقار' }, { status: 500 });
  return Response.json({ success: true });
}
