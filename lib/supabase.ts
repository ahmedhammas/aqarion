import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role for server-side operations
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey);
}

// Database types
export interface DbProperty {
  id: number;
  name: string;
  name_en?: string;
  slug: string;
  location: string;
  city: string;
  district?: string;
  price_num: number;
  price_display: string;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  land_area?: number;
  floor?: number;
  total_floors?: number;
  year_built?: number;
  type: string;
  type_label: string;
  listing_type: string;
  status: string;
  featured: boolean;
  tag?: string;
  description?: string;
  amenities?: string[];
  images?: string[];
  main_image?: string;
  video_url?: string;
  virtual_tour_url?: string;
  latitude?: number;
  longitude?: number;
  views_count: number;
  agent_id?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbBlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author_id?: string;
  category: string;
  tags?: string[];
  status: string;
  views_count: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface DbContactMessage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  property_id?: number;
  status: string;
  reply_text?: string;
  replied_at?: string;
  source: string;
  created_at: string;
}

export interface DbTestimonial {
  id: number;
  client_name: string;
  client_role?: string;
  client_avatar?: string;
  content: string;
  rating: number;
  property_id?: number;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface DbTeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  specialization?: string[];
  social_links?: Record<string, string>;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface DbUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DbSiteSetting {
  key: string;
  value: string;
  label?: string;
  type: string;
  category: string;
  updated_at: string;
}

export interface DbAnalyticsEvent {
  id: number;
  event_type: string;
  property_id?: number;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  search_query?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface DbAd {
  id: number;
  title: string;
  image_url: string;
  link: string;
  position: string; // e.g., 'popup', 'home_banner', 'sidebar'
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

