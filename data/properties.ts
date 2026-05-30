export interface Property {
  id: number;
  name: string;
  location: string;
  city: string;
  price: string;
  priceNum: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'villa' | 'apartment' | 'office' | 'compound';
  typeLabel: string;
  image: string;
  featured: boolean;
  tag?: string;
  images?: string[];
  description?: string;
  amenities?: string[];
  status?: 'available' | 'sold' | 'rented';
  listingType?: 'sale' | 'rent' | 'both';
  yearBuilt?: number;
  floor?: number;
}

export const properties: Property[] = [
  {
    id: 1,
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
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    description: 'فيلا فاخرة بتصميم عصري في قلب الساحل الشمالي. تتمتع بإطلالة مباشرة على البحر مع حديقة خاصة ومسبح. تشطيب سوبر لوكس بأعلى المعايير الأوروبية. موقع متميز بالقرب من جميع الخدمات والمرافق الترفيهية.',
    amenities: ['مسبح خاص', 'حديقة', 'جراج مزدوج', 'تراس', 'نظام أمان ذكي', 'تكييف مركزي'],
    status: 'available',
    listingType: 'sale',
    yearBuilt: 2024,
  },
  {
    id: 2,
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
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    description: 'شقة فاخرة بتشطيب راقٍ في أرقى أحياء الشيخ زايد. تصميم داخلي عصري مع مساحات واسعة ومشرقة. تطل على مناظر خلابة وقريبة من أهم المراكز التجارية والمدارس الدولية.',
    amenities: ['مصعد', 'جراج', 'أمن 24 ساعة', 'حدائق مشتركة', 'نادي اجتماعي'],
    status: 'available',
    listingType: 'sale',
    yearBuilt: 2025,
    floor: 5,
  },
  {
    id: 3,
    name: 'فيلا التجمع الخامس',
    location: 'التجمع الخامس، القاهرة الجديدة',
    city: 'القاهرة',
    price: '٥٫٨ مليون',
    priceNum: 5800000,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    type: 'villa',
    typeLabel: 'فيلا',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    tag: 'حصري',
    images: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    description: 'فيلا مستقلة بالتجمع الخامس بتصميم كلاسيكي فاخر. موقع استراتيجي على شارع رئيسي مع سهولة الوصول لجميع المحاور. حديقة واسعة ومسبح خاص مع غرفة خادمة وجراج لسيارتين.',
    amenities: ['مسبح خاص', 'حديقة واسعة', 'جراج مزدوج', 'غرفة خادمة', 'بدروم', 'تكييف مركزي'],
    status: 'available',
    listingType: 'sale',
    yearBuilt: 2023,
  },
  {
    id: 4,
    name: 'كمبوند سوث زايد',
    location: 'أكتوبر، سوث زايد',
    city: '6 أكتوبر',
    price: '٢٫١ مليون',
    priceNum: 2100000,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    type: 'compound',
    typeLabel: 'كمبوند',
    image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
    images: [
      'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    description: 'وحدة سكنية راقية داخل كمبوند متكامل الخدمات في سوث زايد. يضم الكمبوند مساحات خضراء واسعة وممرات للمشي وركوب الدراجات. بيئة آمنة ومثالية للعائلات.',
    amenities: ['نادي رياضي', 'حمام سباحة مشترك', 'أمن 24 ساعة', 'مساحات خضراء', 'ممرات مشي'],
    status: 'available',
    listingType: 'sale',
    yearBuilt: 2024,
  },
  {
    id: 5,
    name: 'شقة مصر الجديدة',
    location: 'مصر الجديدة، شارع النزهة',
    city: 'القاهرة',
    price: '١٫٩ مليون',
    priceNum: 1900000,
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    type: 'apartment',
    typeLabel: 'شقة',
    image: 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    images: [
      'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    description: 'شقة واسعة في قلب مصر الجديدة بموقع حيوي. قريبة من المترو والخدمات الأساسية. تشطيب ممتاز مع إطلالة مفتوحة. مناسبة للعائلات والمهنيين.',
    amenities: ['مصعد', 'بوابة أمان', 'قريبة من المترو', 'إنتركم'],
    status: 'available',
    listingType: 'rent',
    yearBuilt: 2020,
    floor: 3,
  },
  {
    id: 6,
    name: 'فيلا الساحل الشمالي',
    location: 'الساحل الشمالي، مرسى مطروح',
    city: 'الساحل الشمالي',
    price: '٩٫٥ مليون',
    priceNum: 9500000,
    bedrooms: 6,
    bathrooms: 5,
    area: 400,
    type: 'villa',
    typeLabel: 'فيلا',
    image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    tag: 'فاخر',
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    description: 'فيلا فاخرة بإطلالة بانورامية على البحر المتوسط في أرقى مناطق الساحل الشمالي. تصميم معماري فريد بمساحة 400 م² على أرض 600 م². مسبح إنفينيتي وحديقة استوائية خاصة.',
    amenities: ['مسبح إنفينيتي', 'حديقة استوائية', 'جاكوزي', 'بيتش فرونت', 'غرفة سينما', 'مطبخ خارجي'],
    status: 'available',
    listingType: 'sale',
    yearBuilt: 2025,
  },
  {
    id: 7,
    name: 'مكتب إداري بالعاصمة الإدارية',
    location: 'العاصمة الإدارية، الحي المالي',
    city: 'القاهرة',
    price: '٤٫٢ مليون',
    priceNum: 4200000,
    bedrooms: 0,
    bathrooms: 2,
    area: 120,
    type: 'office',
    typeLabel: 'مكتب',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    images: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    description: 'مكتب إداري فاخر في الحي المالي بالعاصمة الإدارية الجديدة. تشطيب كامل بأحدث التصميمات العصرية. مناسب للشركات والمؤسسات التي تبحث عن موقع استراتيجي.',
    amenities: ['تكييف مركزي', 'إنترنت فائق السرعة', 'غرفة اجتماعات', 'استقبال', 'مواقف سيارات'],
    status: 'available',
    listingType: 'both',
    yearBuilt: 2025,
    floor: 12,
  },
  {
    id: 8,
    name: 'تاون هاوس المستقبل سيتي',
    location: 'المستقبل سيتي، القاهرة الجديدة',
    city: 'القاهرة',
    price: '٣٫٥ مليون',
    priceNum: 3500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    type: 'villa',
    typeLabel: 'تاون هاوس',
    image: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    tag: 'جديد',
    images: [
      'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    description: 'تاون هاوس بتصميم حديث في قلب المستقبل سيتي. وحدة كورنر بمدخل خاص وحديقة أمامية وخلفية. قريب من الجامعة الأمريكية وأهم المراكز التجارية.',
    amenities: ['حديقة أمامية وخلفية', 'جراج', 'أمن 24 ساعة', 'نادي اجتماعي', 'مسجد'],
    status: 'available',
    listingType: 'sale',
    yearBuilt: 2024,
  },
];

export const cities = ['جميع المدن', 'القاهرة', 'الشيخ زايد', 'الساحل الشمالي', '6 أكتوبر'];

export const propertyTypes = ['جميع الأنواع', 'فيلا', 'شقة', 'كمبوند', 'مكتب', 'تاون هاوس'];

export const priceRanges = [
  { label: 'جميع الأسعار', value: 'all' },
  { label: 'أقل من ٢ مليون', value: '0-2000000' },
  { label: '٢ - ٥ مليون', value: '2000000-5000000' },
  { label: '٥ - ١٠ مليون', value: '5000000-10000000' },
  { label: 'أكثر من ١٠ مليون', value: '10000000+' },
];

export const testimonials = [
  {
    id: 1,
    name: 'أحمد محمد الراشد',
    role: 'رجل أعمال',
    content: 'تجربة رائعة مع عقاريون المتحدة. وجدت فيلتي المثالية في التجمع الخامس بسعر منافس جداً. الفريق محترف ومتعاون.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 2,
    name: 'سارة عبدالله الحمدان',
    role: 'مديرة تنفيذية',
    content: 'خدمة استثنائية وعروض عقارية متميزة. ساعدوني في إيجاد الشقة المناسبة بالمواصفات التي أريدها بوقت قصير جداً.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 3,
    name: 'خالد يوسف المنصور',
    role: 'مستثمر عقاري',
    content: 'المنصة الأفضل للبحث عن العقارات في مصر. قاعدة بيانات ضخمة وعروض حصرية لا تجدها في مكان آخر.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 4,
    name: 'منى حسن الشافعي',
    role: 'طبيبة',
    content: 'ساعدوني في إيجاد شقة مثالية في الشيخ زايد قريبة من عيادتي. التعامل كان سلس واحترافي من البداية للنهاية.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 5,
    name: 'عمر الفاروق',
    role: 'مهندس معماري',
    content: 'كمتخصص في العمارة، أقدّر جودة العقارات المعروضة. اختيارات مدروسة وتشطيبات عالية المستوى. أنصح بالتعامل معهم.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export const stats = [
  { label: 'عميل سعيد', value: 1500, suffix: '+' },
  { label: 'عقار مميز', value: 800, suffix: '+' },
  { label: 'سنة خبرة', value: 15, suffix: '' },
  { label: 'مدينة', value: 12, suffix: '' },
];

export const team = [
  {
    name: 'عادل الفيصل',
    role: 'المدير التنفيذي',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'خبرة أكثر من 20 عاماً في السوق العقاري المصري والخليجي.',
  },
  {
    name: 'أيام زايد',
    role: 'مدير المبيعات',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'متخصص في تقييم العقارات وإتمام صفقات البيع باحترافية.',
  },
  {
    name: 'مهاد فلوفيل',
    role: 'خبيرة العقارات',
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'مستشارة عقارية معتمدة مع شغف خاص بالعقارات الفاخرة.',
  },
];

export const blogPosts = [
  {
    id: 1,
    slug: 'future-investment-new-capital',
    title: 'مستقبل الاستثمار العقاري في العاصمة الإدارية',
    excerpt: 'نظرة شاملة على الفرص الاستثمارية الواعدة في العاصمة الإدارية الجديدة وكيف تختار العقار المناسب لضمان أفضل عائد.',
    content: `العاصمة الإدارية الجديدة أصبحت واحدة من أبرز الوجهات الاستثمارية في مصر والشرق الأوسط. مع استمرار الحكومة في نقل المؤسسات الحكومية والبنوك والسفارات إليها، ترتفع قيمة العقارات بشكل مستمر.\n\nلماذا الاستثمار في العاصمة الإدارية؟\n- ارتفاع القيمة السوقية المتوقعة بنسبة 30-50% خلال 5 سنوات\n- بنية تحتية حديثة على أعلى المعايير العالمية\n- قرب من المطار الدولي والطرق الرئيسية\n- تنوع الوحدات بين سكنية وتجارية وإدارية\n\nنصائح للمستثمرين:\n1. ابحث عن المشاريع القريبة من الحي الحكومي والمالي\n2. فضّل الوحدات الجاهزة أو قريبة التسليم\n3. قارن أسعار المتر بين المطورين المختلفين\n4. تأكد من سمعة المطور العقاري وسابقة أعماله`,
    date: '15 مايو 2026',
    author: 'أحمد الراشد',
    image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'استثمار',
  },
  {
    id: 2,
    slug: 'tips-buying-first-villa',
    title: 'نصائح ذهبية قبل شراء فيلتك الأولى',
    excerpt: 'دليلك العملي لمعرفة أهم المعايير التي يجب مراعاتها عند شراء فيلا، من الموقع وحتى جودة التشطيبات.',
    content: `شراء فيلا هو قرار كبير يحتاج تخطيطاً دقيقاً. في هذا الدليل نقدم لك أهم النصائح من خبرائنا.\n\nالموقع أولاً:\n- تأكد من قرب الفيلا من المدارس والمستشفيات\n- تحقق من حالة الطرق المؤدية إليها\n- اسأل عن خطط التطوير المستقبلية للمنطقة\n\nجودة البناء:\n- افحص أساسات المبنى ونوع الخرسانة المستخدمة\n- تحقق من عزل الحرارة والرطوبة\n- اختبر السباكة والكهرباء بعناية\n\nالتشطيبات:\n- قارن بين أنواع التشطيبات المعروضة\n- اسأل عن ضمانات التشطيب\n- زر الوحدة في أوقات مختلفة من اليوم لتقييم الإضاءة الطبيعية`,
    date: '10 مايو 2026',
    author: 'سارة عبدالله',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'نصائح',
  },
  {
    id: 3,
    slug: 'modern-decor-luxury-properties',
    title: 'تصميمات الديكور الحديثة للعقارات الفاخرة',
    excerpt: 'أحدث اتجاهات الديكور الداخلي لعام 2026 وكيف تضيف لمسة من الفخامة والدفء إلى منزلك الجديد.',
    content: `الديكور الداخلي يلعب دوراً محورياً في تحويل أي مساحة إلى تحفة فنية. إليك أبرز اتجاهات 2026.\n\nاتجاهات رئيسية:\n- المزج بين الكلاسيكي والحديث (Neo-Classic)\n- استخدام المواد الطبيعية: الخشب، الحجر، الرخام\n- الألوان الدافئة: البيج، التوب، الذهبي\n- الإضاءة الذكية القابلة للتحكم\n\nنصائح عملية:\n1. ابدأ بتحديد ميزانية واضحة للديكور\n2. استعن بمصمم داخلي محترف\n3. لا تبالغ في الأثاث — المساحات المفتوحة تعطي إحساساً بالرحابة\n4. استثمر في قطع أساسية عالية الجودة بدلاً من كثرة القطع الرخيصة`,
    date: '5 مايو 2026',
    author: 'يوسف المنصور',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'ديكور',
  },
];
