import { adsStore } from '@/lib/admin-store';

export async function GET() {
  const activeAds = adsStore.filter(ad => ad.is_active);
  return Response.json({ ads: activeAds });
}
