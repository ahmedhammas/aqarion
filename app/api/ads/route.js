import { supabase } from '@/lib/supabase';

// Force dynamic rendering for this API route since it accepts query parameters
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const url = request.nextUrl;
    const position = url.searchParams.get('position');

    let query = supabase.from('ads').select('*').eq('is_active', true);

    if (position) {
      query = query.eq('position', position);
    }

    const { data: activeAds, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return Response.json({
      ads: activeAds,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Ads API Error:', error);
    return Response.json({
      ads: [],
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
