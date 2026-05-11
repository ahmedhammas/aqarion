import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();

    const { firstName, lastName, phone, email, message, propertyId } = body;

    if (!firstName || !lastName || !phone || !email || !message) {
      return Response.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('messages').insert([{
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      message,
      property_id: propertyId || null,
      status: 'new',
      source: 'contact_form'
    }]);

    if (error) throw error;

    return Response.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك في أقرب وقت.',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return Response.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة، حاول مرة أخرى' },
      { status: 500 }
    );
  }
}
