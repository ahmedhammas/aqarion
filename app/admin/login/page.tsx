'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import { AdminProvider, useAdmin } from '@/lib/admin-context';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const redirect = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirect);
    } else {
      setError(result.error || 'فشل تسجيل الدخول');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#020a18]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(197,139,91,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,139,91,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-lg"
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="font-cairo font-bold text-3xl text-white mb-2">لوحة التحكم</h1>
          <p className="font-cairo text-white/50">عقاريون المتحدة</p>
        </div>

        {/* Login Card */}
        <div className="glass-card-dark rounded-3xl p-8 border border-gold/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full input-luxury rounded-xl py-3.5 pr-12 pl-4 font-cairo text-sm text-left dir-ltr"
                  placeholder="admin@aqarion.com"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full input-luxury rounded-xl py-3.5 pr-12 pl-12 font-cairo text-sm text-left dir-ltr"
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-cairo text-red-400 text-sm text-center bg-red-400/10 rounded-xl py-3 border border-red-400/20"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl font-cairo font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-cairo text-white/30 text-xs">
              بيانات الدخول التجريبية: admin@aqarion.com / admin123
            </p>
          </div>
        </div>

        <p className="text-center font-cairo text-white/20 text-xs mt-6">
          © 2026 عقاريون المتحدة. جميع الحقوق محفوظة
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AdminProvider>
      <LoginForm />
    </AdminProvider>
  );
}
