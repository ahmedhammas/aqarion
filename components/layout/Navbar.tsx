'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Heart, User as UserIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserAuth } from '@/hooks/useUserAuth';

const navLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'العقارات', href: '/properties' },
  { label: 'من نحن', href: '/#about' },
  { label: 'المدونة', href: '/blog' },
  { label: 'آراء العملاء', href: '/#testimonials' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { count } = useFavorites();
  const { user, logout } = useUserAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Fetch settings
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => setSettings(data.settings))
      .catch(err => console.error('Failed to fetch settings:', err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-navy-dark/95 backdrop-blur-luxury shadow-navy-lg border-b border-gold/10'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Right side (RTL) */}
            <Link href="/" className="flex items-center gap-3 group">
              {settings?.site_logo ? (
                <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-110">
                  <img 
                    src={settings.site_logo} 
                    alt={settings.site_name || 'Logo'} 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="relative w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                  <span className="text-white font-cairo font-bold text-sm leading-tight text-center">عم</span>
                </div>
              )}
              <div className="hidden sm:block">
                <h1 className="font-cairo font-bold text-white text-lg leading-tight group-hover:text-gold transition-colors">
                  {settings?.site_name?.split(' ')[0] || 'عقاريون'}
                </h1>
                <p className="font-cairo text-gold-light text-xs">{settings?.site_name?.split(' ').slice(1).join(' ') || 'المتحدة'}</p>
              </div>
            </Link>

            {/* Nav Links - Center */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link font-cairo text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons - Left side (RTL) */}
            <div className="flex items-center gap-3">
              {/* Favorites Button */}
              <Link
                href="/properties"
                className="relative p-2 rounded-xl border border-gold/20 text-white/70 hover:text-gold hover:border-gold/50 transition-colors"
              >
                <Heart className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>

              {/* User Auth Button */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-xl border border-gold/20 text-white/70 hover:text-gold hover:border-gold/50 transition-colors">
                    <UserIcon className="w-5 h-5" />
                    <span className="font-cairo text-sm hidden sm:block truncate max-w-[80px]">
                      {user.user_metadata?.full_name?.split(' ')[0] || 'حسابي'}
                    </span>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-navy-dark border border-white/10 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl">
                    <div className="p-2 border-b border-white/5 mb-2">
                      <p className="font-cairo text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                    <button onClick={logout} className="w-full text-right flex items-center gap-2 p-2 text-sm text-red-400 hover:bg-white/5 rounded-lg font-cairo transition-colors">
                      <LogOut className="w-4 h-4" /> تسجيل الخروج
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 p-2 rounded-xl border border-gold/20 text-white/70 hover:text-gold hover:border-gold/50 transition-colors"
                  title="تسجيل الدخول"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              <Link
                href="/#contact"
                className="hidden sm:flex items-center gap-2 btn-gold px-5 py-2.5 rounded-full font-cairo text-sm font-semibold"
              >
                <Phone className="w-4 h-4" />
                تواصل بنا
              </Link>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 rounded-xl border border-gold/20 text-white hover:border-gold/50 transition-colors"
                aria-label="القائمة"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-80 z-40 glass-card-dark border-l border-gold/20 pt-24 px-6"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block py-3 px-4 rounded-xl text-white hover:bg-gold/10 hover:text-gold-light font-cairo font-medium transition-colors border border-transparent hover:border-gold/20"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/#contact"
                className="mt-4 btn-gold py-3 px-4 rounded-xl font-cairo font-semibold text-center"
                onClick={() => setIsMobileOpen(false)}
              >
                تواصل بنا
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-30 bg-navy-dark/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
