import { supabase } from '@/lib/supabase';
import { generateAnalytics } from '@/lib/admin-store';

export async function GET() {
  const analytics = generateAnalytics();

  const { data: properties } = await supabase.from('properties').select('id, name, views_count, image:main_image, created_at');
  const { data: messages } = await supabase.from('contact_messages').select('*');
  const { data: blogPosts } = await supabase.from('blog_posts').select('id');

  const safeProperties = properties || [];
  const safeMessages = messages || [];
  const safeBlogPosts = blogPosts || [];

  const kpis = {
    totalProperties: safeProperties.length,
    newMessages: safeMessages.filter(m => m.status === 'new').length,
    totalViews: safeProperties.reduce((s, p) => s + (p.views_count || 0), 0),
    totalPosts: safeBlogPosts.length,
    propertiesGrowth: 12.5,
    messagesGrowth: 8.3,
    viewsGrowth: 15.2,
    postsGrowth: 5.0,
  };

  const topProperties = [...safeProperties]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5)
    .map(p => ({ id: p.id, name: p.name, views: p.views_count || 0, image: p.image }));

  const recentMessages = [...safeMessages]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const recentProperties = [...safeProperties]
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
