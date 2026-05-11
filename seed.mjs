import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const properties = [
  {
    name: 'فيلا الساحل الشمالي',
    location: 'مارينا',
    city: 'الساحل الشمالي',
    price: '١٥,٠٠٠,٠٠٠',
    priceNum: 15000000,
    bedrooms: 5,
    bathrooms: 6,
    area: 450,
    type: 'villa',
    typeLabel: 'فيلا',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'فيلا فاخرة صف أول على البحر مباشرة مع حمام سباحة خاص وحديقة.',
    featured: true,
    tag: 'صف أول',
    status: 'available',
    listingType: 'sale'
  },
  {
    name: 'شقة فاخرة بالشيخ زايد',
    location: 'بيفرلي هيلز',
    city: 'الشيخ زايد',
    price: '٤,٥٠٠,٠٠٠',
    priceNum: 4500000,
    bedrooms: 3,
    bathrooms: 3,
    area: 220,
    type: 'apartment',
    typeLabel: 'شقة',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'شقة تشطيب الترا سوبر لوكس فيو مفتوح على المساحات الخضراء.',
    featured: true,
    tag: 'تشطيب كامل',
    status: 'available',
    listingType: 'sale'
  },
  {
    name: 'مقر إداري بالعاصمة',
    location: 'حي المال والأعمال',
    city: 'العاصمة الإدارية',
    price: '٨,٥٠٠,٠٠٠',
    priceNum: 8500000,
    bedrooms: 0,
    bathrooms: 2,
    area: 150,
    type: 'office',
    typeLabel: 'مكتب',
    image: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'مقر إداري مجهز بالكامل في أميز أبراج العاصمة الإدارية.',
    featured: false,
    status: 'available',
    listingType: 'rent'
  }
];

const team = [
  { name: 'أحمد حسن', role: 'المدير التنفيذي', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'سارة محمد', role: 'مديرة المبيعات', avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'عمر علي', role: 'مستشار عقاري', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800' }
];

const testimonials = [
  { client_name: 'محمد خالد', client_role: 'مستثمر', content: 'أفضل شركة عقارية تعاملت معها، شفافية واحترافية عالية.', client_avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 5, is_published: true },
  { client_name: 'نور أحمد', client_role: 'عميل', content: 'شكراً لفريق العمل على مساعدتي في إيجاد منزل أحلامي بسهولة.', client_avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 5, is_published: true }
];

async function seed() {
  console.log('Seeding Data to Supabase...');
  
  await supabase.from('properties').delete().neq('id', 0);
  await supabase.from('team').delete().neq('id', 0);
  await supabase.from('testimonials').delete().neq('id', 0);

  await supabase.from('properties').insert(properties.map(p => ({ ...p, slug: p.name.replace(/\s+/g, '-') })));
  console.log('Inserted properties.');

  await supabase.from('team').insert(team.map(t => ({ ...t, email: 'info@aqarion.com', is_active: true })));
  console.log('Inserted team.');

  await supabase.from('testimonials').insert(testimonials);
  console.log('Inserted testimonials.');

  console.log('Seeding Complete!');
}

seed();
