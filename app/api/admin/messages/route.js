import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const stats = {
    total: data.length,
    new: data.filter(m => m.status === 'new').length,
    read: data.filter(m => m.status === 'read').length,
    replied: data.filter(m => m.status === 'replied').length,
    archived: data.filter(m => m.status === 'archived').length,
  };
  return Response.json({ messages: data, stats });
}
