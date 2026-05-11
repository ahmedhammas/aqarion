import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `أنت مساعد عقاري ذكي لشركة "عقاريون المتحدة"، متخصص في العقارات المصرية.
تساعد العملاء في:
- البحث عن العقار المناسب حسب الميزانية والموقع
- الإجابة عن أسئلة الشراء والإيجار والاستثمار العقاري
- شرح أنواع العقارات (فلل، شقق، كمبوندات، مكاتب)
- تقديم نصائح عقارية متخصصة
- معلومات عن المناطق: القاهرة الجديدة، التجمع الخامس، الشيخ زايد، الساحل الشمالي، 6 أكتوبر
أجب دائماً باللغة العربية بأسلوب احترافي ومفيد وودود. لا تتجاوز 150 كلمة في الإجابة.
إذا سألك أحد عن أسعار محددة، اذكر أن الأسعار تبدأ من 1.9 مليون جنيه وتصل إلى 9.5 مليون حسب الموقع والمواصفات.`;

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

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Support conversation history from client
    if (body.history && Array.isArray(body.history)) {
      const recentHistory = body.history.slice(-10);
      messages.push(...recentHistory);
    }

    messages.push({ role: "user", content: body.message });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    return Response.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { error: "حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى لاحقاً" },
      { status: 500 }
    );
  }
}