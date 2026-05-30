import { adminCredentials, updateAdminCredentials } from '@/lib/admin-store';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (email === adminCredentials.email && password === adminCredentials.password) {
      return Response.json({
        user: {
          id: 'admin-001',
          email: adminCredentials.email,
          full_name: adminCredentials.full_name,
          role: 'admin',
          avatar_url: adminCredentials.avatar_url,
        }
      });
    }
    return Response.json(
      { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
      { status: 401 }
    );
  } catch {
    return Response.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    admin: {
      email: adminCredentials.email,
      full_name: adminCredentials.full_name,
      avatar_url: adminCredentials.avatar_url,
    }
  });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'update_profile') {
      const patch = {};
      if (body.full_name) patch.full_name = body.full_name;
      if (body.avatar_url !== undefined) patch.avatar_url = body.avatar_url;
      updateAdminCredentials(patch);
      return Response.json({ success: true, message: 'تم تحديث الملف الشخصي بنجاح' });
    }

    if (action === 'change_password') {
      const { current_password, new_password } = body;
      if (current_password !== adminCredentials.password) {
        return Response.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }
      if (!new_password || new_password.length < 6) {
        return Response.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 });
      }
      updateAdminCredentials({ password: new_password });
      return Response.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
    }

    if (action === 'change_email') {
      const { new_email, password } = body;
      if (password !== adminCredentials.password) {
        return Response.json({ error: 'كلمة المرور غير صحيحة' }, { status: 400 });
      }
      if (!new_email) {
        return Response.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
      }
      updateAdminCredentials({ email: new_email });
      return Response.json({ success: true, message: 'تم تغيير البريد الإلكتروني بنجاح' });
    }

    return Response.json({ error: 'عملية غير معروفة' }, { status: 400 });
  } catch {
    return Response.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
