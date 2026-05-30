import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: properties } = await supabase.from('properties').select('id');
  const { data: blogPosts } = await supabase.from('blog_posts').select('slug');

  const propertyUrls = (properties || []).map((p) => ({
    url: `https://aqarion.com/property/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogUrls = (blogPosts || []).map((p) => ({
    url: `https://aqarion.com/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: 'https://aqarion.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://aqarion.com/properties',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://aqarion.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...propertyUrls,
    ...blogUrls,
  ];
}
