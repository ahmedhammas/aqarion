'use client';

import { useState, useEffect } from 'react';
import { Building2, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import AdSection from '../AdSection';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => setSettings(data.settings))
      .catch(err => console.error('Failed to fetch settings:', err));
  }, []);

  return (
    <footer className="bg-[#020a18] pt-20 pb-10 border-t border-gold/10 relative overflow-hidden">
      <AdSection position="footer_banner" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 group">
              {settings?.site_logo ? (
                <div className="w-14 h-14 transition-transform duration-300 group-hover:scale-110">
                  <img src={settings.site_logo} alt={settings.site_name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h2 className="font-cairo font-bold text-white text-xl leading-tight group-hover:text-gold transition-colors">
                  {settings?.site_name?.split(' ')[0] || 'عقاريون'}
                </h2>
                <p className="font-cairo text-gold-light text-sm">{settings?.site_name?.split(' ').slice(1).join(' ') || 'المتحدة'}</p>
              </div>
            </div>
            <p className="font-cairo text-white/50 text-sm leading-relaxed mb-6">
              {settings?.site_tagline || 'شريكك الموثوق في رحلتك العقارية. نقدم لك أفضل الخيارات وأرقى العقارات التي تناسب تطلعاتك في مصر والشرق الأوسط.'}
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/50 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-cairo font-bold text-white text-lg mb-6">روابط سريعة</h3>
            <ul className="space-y-4">
              {[
                { label: 'الرئيسية', href: '#hero' },
                { label: 'عن الشركة', href: '#about' },
                { label: 'العقارات المميزة', href: '#properties' },
                { label: 'المدونة', href: '#blog' },
                { label: 'آراء العملاء', href: '#testimonials' },
                { label: 'تواصل معنا', href: '#contact' },
              ].map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="font-cairo text-white/50 text-sm hover:text-gold transition-colors inline-block transform hover:-translate-x-2">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h3 className="font-cairo font-bold text-white text-lg mb-6">أنواع العقارات</h3>
            <ul className="space-y-4">
              {['فلل للبيع', 'شقق فاخرة', 'مكاتب تجارية', 'شاليهات ساحلية', 'تاون هاوس'].map((link, i) => (
                <li key={i}>
                  <a href="#" className="font-cairo text-white/50 text-sm hover:text-gold transition-colors inline-block transform hover:-translate-x-2">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-cairo font-bold text-white text-lg mb-6">معلومات التواصل</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="font-cairo text-white/50 text-sm">القاهرة، التجمع الخامس، شارع التسعين الجنوبي، مبنى ٤٥</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="font-cairo text-white/50 text-sm dir-ltr inline-block">+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="font-cairo text-white/50 text-sm dir-ltr inline-block">info@aqarion.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-cairo text-white/40 text-sm">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} عقاريون المتحدة
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-cairo text-white/40 text-sm hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="font-cairo text-white/40 text-sm hover:text-white transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
