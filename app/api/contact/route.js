export async function POST(req) {
  try {
    const body = await req.json();

    const { firstName, lastName, phone, email, message } = body;

    if (!firstName || !lastName || !phone || !email || !message) {
      return Response.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    // Log the contact form submission
    console.log('📬 New Contact Form Submission:');
    console.log('---');
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('---');

    // In production, integrate with email service like Resend, SendGrid, or Nodemailer
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@aqarion.com',
    //   to: 'info@aqarion.com',
    //   subject: `رسالة جديدة من ${firstName} ${lastName}`,
    //   text: `الاسم: ${firstName} ${lastName}\nالهاتف: ${phone}\nالبريد: ${email}\nالرسالة: ${message}`,
    // });

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
