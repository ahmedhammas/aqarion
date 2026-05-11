import { generateAnalytics, propertiesStore, messagesStore, blogStore } from '@/lib/admin-store';

export async function GET() {
  const analytics = generateAnalytics();

  const kpis = {
    totalProperties: propertiesStore.length,
    newMessages: messagesStore.filter(m => m.status === 'new').length,
    totalViews: analytics.dailyViews.reduce((s, d) => s + d.views, 0),
    totalPosts: blogStore.length,
    propertiesGrowth: 12.5,
    messagesGrowth: 8.3,
    viewsGrowth: 15.2,
    postsGrowth: 5.0,
  };

  const topProperties = [...propertiesStore]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5)
    .map(p => ({ id: p.id, name: p.name, views: p.views_count || 0, image: p.image }));

  const recentMessages = [...messagesStore]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const recentProperties = [...propertiesStore]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return Response.json({
    kpis,
    topProperties,
    recentMessages,
    recentProperties,
    ...analytics,
  });
}
