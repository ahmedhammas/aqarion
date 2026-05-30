import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mockProperties = [
  {
    name: 'فيلا مراسي الساحل الشمالي الفاخرة',
    location: 'الساحل الشمالي، سيدي عبدالرحمن',
    city: 'الساحل الشمالي',
    price: '١٢٫٥ مليون',
    priceNum: 12500000,
    bedrooms: 6,
    bathrooms: 5,
    area: 450,
    type: 'villa',
    typeLabel: 'فيلا',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    tag: 'مميز',
    listingType: 'sale',
  },
  {
    name: 'شقة التجمع الخامس الراقية',
    location: 'التجمع الخامس، شارع التسعين الجنوبي',
    city: 'القاهرة',
    price: '٤٫٢ مليون',
    priceNum: 4200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    type: 'apartment',
    typeLabel: 'شقة',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    tag: 'جديد',
    listingType: 'sale',
  },
  {
    name: 'توين هاوس كمبوند سوديك',
    location: 'الشيخ زايد، بيفرلي هيلز',
    city: 'الشيخ زايد',
    price: '٨٫٥ مليون',
    priceNum: 8500000,
    bedrooms: 4,
    bathrooms: 4,
    area: 280,
    type: 'townhouse',
    typeLabel: 'تاون هاوس',
    image: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    tag: 'مطلوب',
    listingType: 'sale',
  },
  {
    name: 'مقر إداري بالعاصمة الإدارية',
    location: 'حي المال والأعمال، برج أيقوني',
    city: 'العاصمة الإدارية',
    price: '١٥٠ ألف',
    priceNum: 150000,
    bedrooms: 0,
    bathrooms: 2,
    area: 120,
    type: 'office',
    typeLabel: 'مكتب',
    image: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    tag: 'إيجار',
    listingType: 'rent',
  },
  {
    name: 'شاليه العين السخنة صف أول',
    location: 'العين السخنة، قرية المونت جلالة',
    city: 'العين السخنة',
    price: '٣٫٨ مليون',
    priceNum: 3800000,
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    type: 'apartment',
    typeLabel: 'شاليه',
    image: 'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    tag: 'صيفي',
    listingType: 'sale',
  },
  {
    name: 'فيلا كمبوند قطامية هايتس',
    location: 'القاهرة الجديدة، التجمع الخامس',
    city: 'القاهرة',
    price: '٢٥ مليون',
    priceNum: 25000000,
    bedrooms: 7,
    bathrooms: 6,
    area: 800,
    type: 'villa',
    typeLabel: 'فيلا',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    tag: 'فاخر',
    listingType: 'sale',
  },
  {
    name: 'بنتهاوس بإطلالة على النيل',
    location: 'الزمالك، شارع أبو الفدا',
    city: 'القاهرة',
    price: '١١ مليون',
    priceNum: 11000000,
    bedrooms: 3,
    bathrooms: 3,
    area: 250,
    type: 'apartment',
    typeLabel: 'بنتهاوس',
    image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    tag: 'إطلالة',
    listingType: 'sale',
  },
  {
    name: 'مساحة عمل مشتركة للإيجار',
    location: 'المعادي، شارع 9',
    city: 'القاهرة',
    price: '٢٥ ألف',
    priceNum: 25000,
    bedrooms: 0,
    bathrooms: 4,
    area: 400,
    type: 'office',
    typeLabel: 'مكتب',
    image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    tag: 'مفروش',
    listingType: 'rent',
  }
];

const mockBlog = [
  {
    title: 'مستقبل الاستثمار العقاري في العاصمة الإدارية',
    excerpt: 'نظرة شاملة على الفرص الاستثمارية الواعدة في العاصمة الإدارية الجديدة وكيف تختار العقار المناسب لضمان أفضل عائد.',
    author: 'أحمد الراشد',
    image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'استثمار',
  },
  {
    title: 'كيف تختار منزلك الأول؟ 5 نصائح ذهبية',
    excerpt: 'شراء المنزل الأول هو خطوة كبيرة في حياة أي شخص. تعرف على أهم المعايير لاختيار عقار يناسب ميزانيتك واحتياجاتك.',
    author: 'سارة محمود',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'نصائح عقارية',
  },
  {
    title: 'أفضل المدن الجديدة للعيش في مصر 2026',
    excerpt: 'مقارنة بين الشيخ زايد، التجمع الخامس، والعاصمة الإدارية لاختيار أفضل مكان للعيش مع العائلة وتوافر الخدمات.',
    author: 'خالد عبد الله',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'مدن جديدة',
  }
];

async function seed() {
  console.log('Seeding Properties...');
  
  const formattedProperties = mockProperties.map(p => ({
    name: p.name,
    location: p.location,
    city: p.city,
    price_display: p.price,
    price_num: p.priceNum,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    type: p.type,
    type_label: p.typeLabel,
    main_image: p.image,
    featured: p.featured,
    tag: p.tag,
    listing_type: p.listingType,
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
