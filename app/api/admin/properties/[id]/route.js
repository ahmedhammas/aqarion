import { supabase } from '@/lib/supabase';

export async function GET(req, { params }) {
  const id = params.id;
  const { data, error } = await supabase.from('properties').select('*, priceNum:pricenum, typeLabel:typelabel, listingType:listingtype').eq('id', id).single();
  
  if (error || !data) return Response.json({ error: 'العقار غير موجود' }, { status: 404 });
  return Response.json({ property: data });
}

export async function PUT(req, { params }) {
  const id = params.id;
  const body = await req.json();

  const updateData = { ...body, updated_at: new Date().toISOString() };
  
  // Map camelCase to snake_case if necessary for DB consistency
  if (updateData.priceNum) { updateData.pricenum = updateData.priceNum; delete updateData.priceNum; }
  if (updateData.typeLabel) { updateData.typelabel = updateData.typeLabel; delete updateData.typeLabel; }
  if (updateData.listingType) { updateData.listingtype = updateData.listingType; delete updateData.listingType; }

  const { data, error } = await supabase.from('properties').update(updateData).eq('id', id).select().single();
  
  if (error) return Response.json({ error: 'فشل تحديث العقار' }, { status: 500 });
  return Response.json({ property: data });
}

export async function DELETE(req, { params }) {
  const id = params.id;
  const { error } = await supabase.from('properties').delete().eq('id', id);
  
  if (error) return Response.json({ error: 'فشل حذف العقار' }, { status: 500 });
  return Response.json({ success: true });
}
