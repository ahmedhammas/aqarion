/**
 * SINGLETON STORE using globalThis
 *
 * WHY: In Next.js, each API route handler can import a fresh module instance
 * during hot-reload or across requests. Using plain `let` variables means
 * route A's mutations are invisible to route B.
 *
 * FIX: We attach the store to `globalThis` so it is initialized ONCE and
 * shared across every import in the same Node.js process.
 */

import { properties, blogPosts, testimonials, team } from '@/data/properties';

// ─── Initializer helpers (run only on first boot) ──────────────────────────

function initProperties() {
  return properties.map((p, i) => ({
    ...p,
    slug: p.name.replace(/\s+/g, '-'),
    views_count: Math.floor(Math.random() * 500) + 50,
    is_published: true,
    created_at: new Date(Date.now() - i * 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

function initMessages() {
  return [
    { id: 1, first_name: 'أحمد', last_name: 'محمد', email: 'ahmed@example.com', phone: '+201012345678', message: 'أريد الاستفسار عن فيلا الساحل الشمالي', property_id: 1, status: 'new', source: 'contact_form', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, first_name: 'سارة', last_name: 'علي', email: 'sara@example.com', phone: '+201098765432', message: 'هل يمكن ترتيب زيارة للشقة في الشيخ زايد؟', property_id: 2, status: 'new', source: 'contact_form', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, first_name: 'خالد', last_name: 'يوسف', email: 'khaled@example.com', phone: '+201155566677', message: 'ما هي خطط الدفع المتاحة لكمبوند سوث زايد؟', property_id: 4, status: 'read', source: 'contact_form', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 4, first_name: 'منى', last_name: 'حسن', email: 'mona@example.com', phone: '+201234567890', message: 'أبحث عن فيلا في التجمع الخامس', property_id: null, status: 'replied', reply_text: 'نعم لدينا خيارات ممتازة، سنتواصل معك قريباً', source: 'contact_form', created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: 5, first_name: 'عمر', last_name: 'فاروق', email: 'omar@example.com', phone: '+201199887766', message: 'مهتم بالاستثمار العقاري في العاصمة الإدارية', property_id: 7, status: 'new', source: 'whatsapp', created_at: new Date(Date.now() - 43200000).toISOString() },
    { id: 6, first_name: 'فاطمة', last_name: 'إبراهيم', email: 'fatma@example.com', phone: '+201177889900', message: 'أريد شقة للإيجار في مصر الجديدة', property_id: 5, status: 'new', source: 'contact_form', created_at: new Date(Date.now() - 1800000).toISOString() },
  ];
}

function initTestimonials() {
  return testimonials.map((t, i) => ({
    ...t,
    id: i + 1,
    client_name: t.name,
    client_role: t.role,
    client_avatar: t.avatar,
    is_published: true,
    is_featured: false,
    created_at: new Date().toISOString(),
  }));
}

function initTeam() {
  return team.map((t, i) => ({
    id: i + 1,
    ...t,
    email: `${t.name.split(' ')[0].toLowerCase()}@aqarion.com`,
    phone: '+201012345678',
    whatsapp: '+201012345678',
    specialization: ['عقارات سكنية', 'استثمار'],
    social_links: {},
    is_active: true,
    display_order: i,
    created_at: new Date().toISOString(),
  }));
}

function initBlog() {
  return blogPosts.map((p, i) => ({
    ...p,
    id: p.id || i + 1,
    cover_image: p.image,
    author_id: null,
    tags: [p.category],
    status: 'published',
    views_count: Math.floor(Math.random() * 300) + 20,
    seo_title: p.title,
    seo_description: p.excerpt,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

function initSettings() {
  return {
    site_name: 'عقاريون المتحدة',
    site_tagline: 'منصة العقارات الفاخرة في مصر',
    site_logo: '/logo.png',
    whatsapp_number: '201001234567',
    phone_number: '+20 123 456 7890',
    email: 'info@aqarion.com',
    address: 'القاهرة، التجمع الخامس، شارع التسعين',
    announcement_text: 'عروض حصرية على فيلل الساحل الشمالي | تواصل الآن',
    announcement_active: 'true',
    properties_per_page: '6',
    openai_model: 'gpt-4o-mini',
  };
}

function initAds() {
  return [
    {
      id: 1,
      title: 'عرض الصيف - الساحل الشمالي',
      image_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
      link: '/properties/villa-north-coast',
      position: 'home_banner',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'استثمار في العاصمة الإدارية',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      link: '/properties/admin-capital-office',
      position: 'popup',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function initClients() {
  return [
    {
      id: 'client-001',
      email: 'client1@example.com',
      full_name: 'أحمد محمد',
      phone: '+201012345678',
      role: 'client',
      is_active: true,
      notes: 'عميل مهتم بالفلل',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'client-002',
      email: 'sara@example.com',
      full_name: 'سارة علي',
      phone: '+201098765432',
      role: 'client',
      is_active: true,
      notes: 'تبحث عن شقة في الشيخ زايد',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];
}

function initAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@aqarion.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    full_name: 'مدير النظام',
    avatar_url: null,
  };
}

// ─── Singleton bootstrap ────────────────────────────────────────────────────
// Using globalThis ensures a single instance regardless of how many times
// this module is imported (Next.js hot-reload, multiple API routes, etc.)

if (!globalThis.__aqarionStore) {
  globalThis.__aqarionStore = {
    properties:    initProperties(),
    messages:      initMessages(),
    testimonials:  initTestimonials(),
    team:          initTeam(),
    blog:          initBlog(),
    settings:      initSettings(),
    ads:           initAds(),
    clients:       initClients(),
    adminCredentials: initAdminCredentials(),
  };
}

const store = globalThis.__aqarionStore;

// ─── Named exports (always point to the live singleton arrays/objects) ──────
export const propertiesStore    = store.properties;
export const messagesStore      = store.messages;
export const testimonialsStore  = store.testimonials;
export const teamStore          = store.team;
export const blogStore          = store.blog;
export const settingsStore      = store.settings;
export const adsStore           = store.ads;
export const clientsStore       = store.clients;
export const adminCredentials   = store.adminCredentials;

// ─── Mutator helpers (use these instead of direct array methods) ─────────────
// They mutate the shared singleton arrays in-place so every route sees the change.

export function updateSettings(patch) {
  Object.assign(store.settings, patch);
}

export function updateAdminCredentials(patch) {
  Object.assign(store.adminCredentials, patch);
}

// ─── Analytics generator ─────────────────────────────────────────────────────
export function generateAnalytics() {
  const days = 30;
  const dailyViews = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    dailyViews.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 200) + 50,
      contacts: Math.floor(Math.random() * 10) + 1,
    });
  }
  const cityViews = [
    { city: 'القاهرة', views: 1250 },
    { city: 'الشيخ زايد', views: 890 },
    { city: 'الساحل الشمالي', views: 1100 },
    { city: '6 أكتوبر', views: 670 },
    { city: 'العاصمة الإدارية', views: 920 },
  ];
  const typeDistribution = [
    { name: 'فيلا', value: 35 },
    { name: 'شقة', value: 30 },
    { name: 'كمبوند', value: 20 },
    { name: 'مكتب', value: 10 },
    { name: 'تاون هاوس', value: 5 },
  ];
  const sourceDistribution = [
    { name: 'بحث مباشر', value: 40 },
    { name: 'جوجل', value: 25 },
    { name: 'فيسبوك', value: 20 },
    { name: 'واتساب', value: 10 },
    { name: 'مرجع', value: 5 },
  ];
  return { dailyViews, cityViews, typeDistribution, sourceDistribution };
}
