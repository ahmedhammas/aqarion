-- ======================================================
-- عقاريون المتحدة - Supabase Database Schema
-- ======================================================

-- 1. USERS (مستخدمو النظام)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROPERTIES (العقارات)
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  price_num BIGINT NOT NULL,
  price_display TEXT NOT NULL,
  currency TEXT DEFAULT 'EGP',
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  area NUMERIC NOT NULL,
  land_area NUMERIC,
  floor INT,
  total_floors INT,
  year_built INT,
  type TEXT NOT NULL,
  type_label TEXT NOT NULL,
  listing_type TEXT DEFAULT 'sale' CHECK (listing_type IN ('sale','rent','both')),
  status TEXT DEFAULT 'available' CHECK (status IN ('available','sold','rented','reserved')),
  featured BOOLEAN DEFAULT FALSE,
  tag TEXT,
  description TEXT,
  amenities TEXT[],
  images TEXT[],
  main_image TEXT,
  video_url TEXT,
  virtual_tour_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  views_count INT DEFAULT 0,
  agent_id UUID REFERENCES users(id),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BLOG_POSTS (مقالات المدونة)
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID REFERENCES users(id),
  category TEXT NOT NULL,
  tags TEXT[],
  status TEXT DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  views_count INT DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTACT_MESSAGES (رسائل التواصل)
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  property_id INT REFERENCES properties(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  reply_text TEXT,
  replied_at TIMESTAMPTZ,
  source TEXT DEFAULT 'contact_form',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TESTIMONIALS (آراء العملاء)
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_role TEXT,
  client_avatar TEXT,
  content TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  property_id INT REFERENCES properties(id),
  is_published BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEAM_MEMBERS (فريق العمل)
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  specialization TEXT[],
  social_links JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROPERTY_FAVORITES (المفضلة)
CREATE TABLE IF NOT EXISTS property_favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id INT REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- 8. ANALYTICS_EVENTS (تتبع الأحداث)
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  property_id INT REFERENCES properties(id),
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  search_query TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SITE_SETTINGS (إعدادات الموقع)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT,
  type TEXT DEFAULT 'text',
  category TEXT DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================
-- INDEXES
-- ======================================================
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_num);
CREATE INDEX IF NOT EXISTS idx_properties_published ON properties(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);

-- ======================================================
-- DEFAULT SITE SETTINGS
-- ======================================================
INSERT INTO site_settings (key, value, label, type, category) VALUES
('site_name', 'عقاريون المتحدة', 'اسم الموقع', 'text', 'general'),
('site_tagline', 'منصة العقارات الفاخرة في مصر', 'الشعار', 'text', 'general'),
('whatsapp_number', '201001234567', 'رقم واتساب', 'text', 'contact'),
('phone_number', '+20 123 456 7890', 'رقم الهاتف', 'text', 'contact'),
('email', 'info@aqarion.com', 'البريد الإلكتروني', 'text', 'contact'),
('address', 'القاهرة، التجمع الخامس، شارع التسعين', 'العنوان', 'text', 'contact'),
('announcement_text', 'عروض حصرية على فيلل الساحل الشمالي | تواصل الآن', 'نص الإعلان', 'text', 'marketing'),
('announcement_active', 'true', 'تفعيل الإعلان', 'boolean', 'marketing'),
('properties_per_page', '6', 'عقارات في الصفحة', 'number', 'listings'),
('openai_model', 'gpt-4o-mini', 'نموذج الذكاء الاصطناعي', 'text', 'ai')
ON CONFLICT (key) DO NOTHING;
