import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mockProperties = [
  {
    name: 'فيلا نورث كوست الفاخرة',
    location: 'الساحل الشمالي، الكيلو 120',
    city: 'الساحل الشمالي',
    price: '٧٫٥ مليون',
    priceNum: 7500000,
    bedrooms: 5,
    bathrooms: 4,
    area: 300,
    type: 'villa',
    typeLabel: 'فيلا',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    tag: 'مميز',
    listingType: 'sale',
  },
  {
    name: 'شقة الشيخ زايد الراقية',
    location: 'الشيخ زايد، الحي الثالث',
    city: 'الشيخ زايد',
    price: '٣٫٢ مليون',
    priceNum: 3200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    type: 'apartment',
    typeLabel: 'شقة',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    tag: 'جديد',
    listingType: 'sale',
  }
];

const mockBlog = [
  {
    title: 'مستقبل الاستثمار العقاري في العاصمة الإدارية',
    excerpt: 'نظرة شاملة على الفرص الاستثمارية الواعدة في العاصمة الإدارية الجديدة وكيف تختار العقار المناسب لضمان أفضل عائد.',
    author: 'أحمد الراشد',
    image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'استثمار',
  }
];

async function seed() {
  console.log('Seeding Properties...');
  
  const formattedProperties = mockProperties.map(p => ({
    name: p.name,
    location: p.location,
    city: p.city,
    price: p.price,
    pricenum: p.priceNum,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    type: p.type,
    typelabel: p.typeLabel,
    image: p.image,
    featured: p.featured,
    tag: p.tag,
    listingtype: p.listingType,
    slug: p.name.replace(/\s+/g, '-'),
    description: 'عقار فاخر بمواصفات عالمية',
    status: 'available',
    is_published: true
  }));

  const { error: pError } = await supabase.from('properties').insert(formattedProperties);
  if (pError) console.error('Error properties:', pError);

  console.log('Seeding Blog Posts...');
  const formattedBlog = mockBlog.map(p => ({
    title: p.title,
    excerpt: p.excerpt,
    author: p.author,
    cover_image: p.image,
    category: p.category,
    slug: p.title.replace(/\s+/g, '-'),
    content: p.excerpt,
    tags: [p.category],
    status: 'published'
  }));

  const { error: bError } = await supabase.from('blog_posts').insert(formattedBlog);
  if (bError) console.error('Error blog:', bError);

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed();
