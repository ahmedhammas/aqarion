import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

// Force dynamic rendering - prevents build-time execution on Vercel
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.message || body.message.trim() === "") {
      return Response.json(
        { error: "الرسالة فارغة" },
        { status: 400 }
      );
    }

    if (body.message.length > 500) {
      return Response.json(
        { error: "الرسالة طويلة جداً، حاول اختصارها" },
        { status: 400 }
      );
    }

    // 1. Fetch site settings to get custom openai model or site name
    let siteName = "عقاريون المتحدة";
    let openaiModel = "gpt-4o-mini";
    try {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("site_name, openai_model")
        .eq("id", 1)
        .maybeSingle();
      if (settings) {
        if (settings.site_name) siteName = settings.site_name;
        if (settings.openai_model) openaiModel = settings.openai_model;
      }
    } catch (e) {
      console.error("Error fetching settings:", e);
    }

    // 2. Fetch all properties (which act as products/devices/accessories/parts)
    let properties = [];
    try {
      const { data: props, error: propsErr } = await supabase
        .from("properties")
        .select("id, name, type, type_label, price_num, price_display, main_image, description, status, location, city, listing_type, bedrooms, bathrooms, area")
        .eq("is_published", true);
      if (!propsErr && props) {
        properties = props;
      }
    } catch (e) {
      console.error("Error fetching properties:", e);
    }

    // 3. Fetch all blog posts (which act as hardware/software troubleshooting articles)
    let blogs = [];
    try {
      const { data: posts, error: postsErr } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, slug, category, status")
        .eq("status", "published");
      if (!postsErr && posts) {
        blogs = posts;
      }
    } catch (e) {
      console.error("Error fetching blogs:", e);
    }

    // 4. Construct lists of products and blogs to inject into prompt
    const productsContext = properties.map(p => {
      return `- [ID: ${p.id}] ${p.name} | النوع: ${p.type_label || p.type} | السعر: ${p.price_display} (${p.price_num} ج.م) | الحالة: ${p.status === 'available' ? 'متوفر' : 'غير متوفر'} | الوصف: ${p.description || ''} | الموقع: ${p.location}, ${p.city}`;
    }).join("\n");

    const blogsContext = blogs.map(b => {
      return `- [ID: ${b.id}] العنوان: ${b.title} | القسم: ${b.category} | الملخص: ${b.excerpt || ''} | الرابط التعريفي: ${b.slug}`;
    }).join("\n");

    // 5. Construct the advanced system prompt
    const SYSTEM_PROMPT = `أنت مساعد ذكي ومستشار فني لمتجر ومنصة "${siteName}".
تساعد المستخدمين والعملاء في:
1. الاستعلام عن الأجهزة، وقطع الغيار، والاكسسوارات، وكل المنتجات والخدمات المعروضة على الموقع.
2. الكشف عن تفاصيل المنتجات، وأسعارها، وحالة توفرها (متوفرة أم غير متوفرة).
3. تقديم حلول ومقترحات تقنية وحلول صيانة للمشاكل الفنية سواء في السوفت وير (Software) أو الهارد وير (Hardware) للهواتف، أجهزة الكمبيوتر، وغيرها.
4. إحالة المستخدمين للمنتجات والقطع المتوفرة على الموقع أو المقالات التي تحل مشكلتهم.

قائمة المنتجات (الأجهزة وقطع الغيار والاكسسوارات) المتوفرة حالياً في قاعدة البيانات:
${productsContext || "لا توجد منتجات مسجلة حالياً."}

قائمة المقالات والمواضيع المتوفرة في المدونة:
${blogsContext || "لا توجد مقالات مسجلة حالياً."}

قواعد وإرشادات الإجابة الهامة جداً:
- أجب دائماً باللغة العربية بأسلوب فني واحترافي، وودود، ومقنع ولبق جداً.
- لا تتجاوز 180 كلمة في الإجابة وحافظ على الاختصار المفيد.
- **توجيه المستخدم للمنتجات (التحويل)**: إذا سأل المستخدم عن منتج (جهاز، قطع غيار، اكسسوارات، إلخ) أو اقترحت عليه منتجاً متوفراً لحل مشكلته، يجب عليك ذكره وإدراج الكود الخاص به في النص بصيغة [property:ID] حيث ID هو الرقم التعريفي للمنتج بدقة. مثال: "لدينا شاحن آيفون أصلي [property:2] بسعر ممتاز...".
- **توجيه المستخدم للمقالات**: إذا كان هناك مقال في المدونة يساعد المستخدم في حل مشكلته (سوفت وير أو هارد وير)، اقترحه عليه وأدرج الكود الخاص به بصيغة [blog:ID] حيث ID هو الرقم التعريفي للمقال. مثال: "يمكنك قراءة دليلنا الشامل لحل مشكلة البطارية [blog:1]...".
- إذا لم يكن المنتج المطلوب متوفراً في القائمة المتاحة أعلاه، أخبر المستخدم بوضوح ولطف أنه غير متوفر حالياً، واقترح عليه البدائل المتاحة أو قدم له نصائح تقنية بديلة، واسأله إذا كان يريد ترك رسالة أو تواصل مع الدعم الفني.
- لا تخترع منتجات غير موجودة في القائمة المتاحة أعلاه، بل التزم بما هو مسجل فقط كمنتجات متوفرة على الموقع.
- إذا سأل المستخدم عن مشكلة سوفت وير أو هارد وير، أعطه حلاً وخطوات واضحة وبسيطة، ثم اقترح عليه القطع اللازمة (إن وجدت) أو مقال صيانة بالموقع.`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Support conversation history from client
    if (body.history && Array.isArray(body.history)) {
      const recentHistory = body.history.slice(-10);
      messages.push(...recentHistory);
    }

    messages.push({ role: "user", content: body.message });

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: openaiModel,
      messages,
      max_tokens: 400,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;

    // 6. Extract matched property/product IDs and blog IDs from the reply using regex
    const propertyRegex = /\[property:(\d+)\]/g;
    const blogRegex = /\[blog:(\d+)\]/g;

    const matchedPropertyIds = [];
    const matchedBlogIds = [];

    let match;
    while ((match = propertyRegex.exec(reply)) !== null) {
      matchedPropertyIds.push(parseInt(match[1]));
    }
    while ((match = blogRegex.exec(reply)) !== null) {
      matchedBlogIds.push(parseInt(match[1]));
    }

    // 7. Get full records of matched items from our pre-fetched lists
    const matchedProperties = properties.filter(p => matchedPropertyIds.includes(p.id));
    const matchedBlogs = blogs.filter(b => matchedBlogIds.includes(b.id));

    return Response.json({
      reply,
      matchedProperties,
      matchedBlogs
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { error: "حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى لاحقاً" },
      { status: 500 }
    );
  }
}