'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, Loader2, LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        throw error;
      }

      if (data.user) {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
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
            <h1 className="font-cairo font-bold text-3xl text-white mb-2">تسجيل الدخول</h1>
            <p className="font-cairo text-white/50 text-sm">مرحباً بك مجدداً في عقاريون المتحدة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-cairo text-center">
                {error}
              </div>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 rounded-xl font-cairo font-bold flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              دخول
            </button>

            <div className="text-center pt-4 border-t border-white/10 mt-6">
              <p className="font-cairo text-sm text-white/60">
                ليس لديك حساب؟{' '}
                <Link href="/register" className="text-gold hover:text-gold-light font-bold transition-colors">
                  سجل الآن
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
