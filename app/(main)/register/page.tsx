'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, Loader2, UserPlus, ArrowRight, Phone } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
        }
        if (error.message.includes('Password should be at least')) {
          throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        }
        throw error;
      }

      // Synchronize normal user accounts into the users table for dashboard and database consistency.
      try {
        const userId = data?.user?.id;
        const userRecord: any = {
          email,
          full_name: name,
          phone: phone,
          role: 'user',
          is_active: true,
        };
        if (userId) {
          userRecord.id = userId;
        }

        const { error: insertError } = await supabase.from('users').upsert([userRecord], { onConflict: 'email' });
        if (insertError) {
          console.error('Failed syncing new user to users table:', insertError);
        }
      } catch (syncError) {
        console.error('User sync error:', syncError);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/20 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span className="font-cairo text-sm">العودة للرئيسية</span>
        </Link>

        <div className="glass-card-dark rounded-3xl p-8 border border-gold/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-cairo font-bold text-3xl text-white mb-2">إنشاء حساب جديد</h1>
            <p className="font-cairo text-white/50 text-sm">انضم إلينا واستمتع بمميزات حصرية</p>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                <UserPlus className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="font-cairo font-bold text-xl text-emerald-400">تم إنشاء الحساب بنجاح!</h2>
              <p className="font-cairo text-white/60 text-sm">جاري تحويلك لصفحة تسجيل الدخول...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-cairo text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block font-cairo text-sm text-white/70">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full input-luxury rounded-xl py-3 pr-12 pl-4 font-cairo text-sm"
                    placeholder="الاسم الكامل"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-cairo text-sm text-white/70">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full input-luxury rounded-xl py-3 pr-12 pl-4 font-cairo text-sm"
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-cairo text-sm text-white/70">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full input-luxury rounded-xl py-3 pr-12 pl-4 font-cairo text-sm"
                    placeholder="example@domain.com"
                    dir="ltr"
                  />
                </div>
              </div>


              <div className="space-y-2">
                <label className="block font-cairo text-sm text-white/70">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full input-luxury rounded-xl py-3 pr-12 pl-4 font-cairo text-sm"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-cairo text-sm text-white/70">تأكيد كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full input-luxury rounded-xl py-3 pr-12 pl-4 font-cairo text-sm"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3 rounded-xl font-cairo font-bold flex items-center justify-center gap-2 mt-6"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                إنشاء حساب
              </button>

              <div className="text-center pt-4 border-t border-white/10 mt-6">
                <p className="font-cairo text-sm text-white/60">
                  لديك حساب بالفعل؟{' '}
                  <Link href="/login" className="text-gold hover:text-gold-light font-bold transition-colors">
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
