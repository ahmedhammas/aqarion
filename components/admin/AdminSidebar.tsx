'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, FileText, MessageSquare, Star, Users,
  BarChart3, Settings, LogOut, Menu, X, Bell, ChevronLeft, Layout,
  UserPlus, ExternalLink, Shield, Activity, Zap
} from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, group: 'main' },
  { href: '/admin/properties', label: 'العقارات', icon: Building2, group: 'content' },
  { href: '/admin/blog', label: 'المدونة', icon: FileText, group: 'content' },
  { href: '/admin/messages', label: 'الرسائل', icon: MessageSquare, group: 'content', badge: true },
  { href: '/admin/ads', label: 'المساحات الإعلانية', icon: Layout, group: 'content' },
  { href: '/admin/testimonials', label: 'آراء العملاء', icon: Star, group: 'content' },
  { href: '/admin/team', label: 'فريق العمل', icon: Users, group: 'content' },
  { href: '/admin/clients', label: 'حسابات العملاء', icon: UserPlus, group: 'content' },
  { href: '/admin/analytics', label: 'التحليلات', icon: BarChart3, group: 'system' },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings, group: 'system' },
];

const groupLabels: Record<string, string> = {
  main: 'الرئيسية',
  content: 'المحتوى',
  system: 'النظام',
};

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newMessages, setNewMessages] = useState(0);
  const pathname = usePathname();
  const { user, logout } = useAdmin();

  useEffect(() => {
    // Fetch new messages count for badge
    fetch('/api/admin/messages')
      .then(r => r.json())
      .then(d => {
        const newCount = (d.messages || []).filter((m: any) => m.status === 'new').length;
        setNewMessages(newCount);
      })
      .catch(() => {});
  }, [pathname]);

  const groups = ['main', 'content', 'system'];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Header */}
      <div className="px-4 py-5 border-b border-white/5">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #C58B5B 0%, #d4a76a 60%, #a5713d 100%)' }}
            >
              <span className="text-white font-cairo font-bold text-xs">عم</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#020a18]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-cairo font-bold text-white text-sm truncate">عقاريون المتحدة</h1>
              <p className="font-cairo text-[10px] flex items-center gap-1" style={{ color: '#C58B5B' }}>
                <Activity className="w-2.5 h-2.5" />
                لوحة التحكم
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {groups.map(group => {
          const links = sidebarLinks.filter(l => l.group === group);
          return (
            <div key={group}>
              {!collapsed && (
                <p className="font-cairo text-[9px] font-bold uppercase tracking-widest text-white/20 px-3 mb-2">
                  {groupLabels[group]}
                </p>
              )}
              <div className="space-y-0.5">
                {links.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-cairo text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'text-white'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                      style={isActive ? {
                        background: 'linear-gradient(135deg, rgba(197,139,91,0.2) 0%, rgba(197,139,91,0.05) 100%)',
                        borderLeft: '2px solid #C58B5B',
                      } : {}}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: 'linear-gradient(135deg, rgba(197,139,91,0.15) 0%, rgba(197,139,91,0.03) 100%)' }}
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <link.icon
                        className={`w-4 h-4 flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-gold' : 'group-hover:text-white/80'}`}
                        style={isActive ? { color: '#C58B5B' } : {}}
                      />
                      {!collapsed && (
                        <span className="relative z-10 truncate">{link.label}</span>
                      )}
                      {link.badge && !collapsed && newMessages > 0 && (
                        <span className="mr-auto relative z-10 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                          {newMessages}
                        </span>
                      )}
                      {link.badge && collapsed && newMessages > 0 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-white/5">
          <div
            className="rounded-xl p-3 mb-3 border"
            style={{
              background: 'linear-gradient(135deg, rgba(197,139,91,0.1) 0%, rgba(197,139,91,0.03) 100%)',
              borderColor: 'rgba(197,139,91,0.2)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5" style={{ color: '#C58B5B' }} />
              <span className="font-cairo text-xs font-bold text-white">إجراءات سريعة</span>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/properties/new"
                className="flex-1 py-1.5 px-2 rounded-lg font-cairo text-[10px] font-bold text-center transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #C58B5B, #d4a76a)', color: '#fff' }}
              >
                + عقار
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-1 py-1.5 px-2 rounded-lg font-cairo text-[10px] font-medium border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                الموقع
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* User Section */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl hover:bg-white/5 transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-cairo text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(197,139,91,0.3), rgba(197,139,91,0.1))' }}
          >
            {user?.full_name?.charAt(0) || 'م'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-cairo text-white text-xs font-bold truncate">{user?.full_name || 'مدير النظام'}</p>
              <p className="font-cairo text-white/30 text-[10px] truncate">{user?.email || 'admin@aqarion.com'}</p>
            </div>
          )}
          {!collapsed && (
            <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#C58B5B' }} />
          )}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all font-cairo text-sm"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 right-0 h-screen z-40 transition-all duration-300 border-l`}
        style={{
          width: collapsed ? '70px' : '260px',
          background: 'linear-gradient(180deg, #020a18 0%, #030d1f 100%)',
          borderColor: 'rgba(197,139,91,0.1)',
        }}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -left-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-all border"
          style={{
            background: '#020a18',
            borderColor: 'rgba(197,139,91,0.3)',
            color: 'rgba(255,255,255,0.4)',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C58B5B')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Mobile Header */}
      <div
        className="lg:hidden fixed top-0 right-0 left-0 z-40 h-14 backdrop-blur-xl border-b flex items-center justify-between px-4"
        style={{
          background: 'rgba(2,10,24,0.95)',
          borderColor: 'rgba(197,139,91,0.1)',
        }}
      >
        <button onClick={() => setMobileOpen(true)} className="text-white p-1">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C58B5B, #d4a76a)' }}
          >
            <span className="text-white font-cairo font-bold text-[10px]">عم</span>
          </div>
          <span className="font-cairo font-bold text-white text-sm">لوحة التحكم</span>
        </div>
        <button className="relative text-white/60 p-1">
          <Bell className="w-5 h-5" />
          {newMessages > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
              {newMessages}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 h-full w-[280px] z-50 border-l"
              style={{
                background: 'linear-gradient(180deg, #020a18 0%, #030d1f 100%)',
                borderColor: 'rgba(197,139,91,0.1)',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 left-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
