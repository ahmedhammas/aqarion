import { adsStore } from '@/lib/admin-store';

// Force dynamic rendering for this API route since it accepts query parameters
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const url = request.nextUrl;
    const position = url.searchParams.get('position');

    let activeAds = adsStore.filter(ad => ad.is_active);

    if (position) {
      activeAds = activeAds.filter(ad => ad.position === position);
    }

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
