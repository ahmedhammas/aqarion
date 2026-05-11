'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building2, MessageSquare, Eye, FileText, TrendingUp, TrendingDown,
  Plus, PenSquare, Mail, ArrowLeft, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const GOLD = '#C58B5B';
const GOLD_LIGHT = '#d4a76a';
const NAVY = '#071739';
const COLORS = ['#C58B5B', '#3a65bb', '#d4a76a', '#6d8dd4', '#a5713d'];

interface DashboardData {
  kpis: {
    totalProperties: number;
    newMessages: number;
    totalViews: number;
    totalPosts: number;
    propertiesGrowth: number;
    messagesGrowth: number;
    viewsGrowth: number;
    postsGrowth: number;
  };
  dailyViews: { date: string; views: number; contacts: number }[];
  cityViews: { city: string; views: number }[];
  typeDistribution: { name: string; value: number }[];
  topProperties: { id: number; name: string; views: number; image: string }[];
  recentMessages: { id: number; first_name: string; last_name: string; message: string; status: string; created_at: string }[];
  recentProperties: { id: number; name: string; price: string; image: string; created_at: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const kpiCards = [
    { title: 'إجمالي العقارات', value: data.kpis.totalProperties, growth: data.kpis.propertiesGrowth, icon: Building2, color: 'from-gold/20 to-gold/5' },
    { title: 'رسائل جديدة', value: data.kpis.newMessages, growth: data.kpis.messagesGrowth, icon: MessageSquare, color: 'from-blue-500/20 to-blue-500/5' },
    { title: 'المشاهدات', value: data.kpis.totalViews.toLocaleString('ar-EG'), growth: data.kpis.viewsGrowth, icon: Eye, color: 'from-emerald-500/20 to-emerald-500/5' },
    { title: 'المقالات', value: data.kpis.totalPosts, growth: data.kpis.postsGrowth, icon: FileText, color: 'from-purple-500/20 to-purple-500/5' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-cairo font-bold text-2xl md:text-3xl text-white">مرحباً بك 👋</h1>
          <p className="font-cairo text-white/50 text-sm mt-1">إليك نظرة عامة على منصتك اليوم</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/properties/new" className="btn-gold px-4 py-2 rounded-xl font-cairo text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> إضافة عقار
          </Link>
          <Link href="/admin/blog/new" className="btn-outline-gold px-4 py-2 rounded-xl font-cairo text-sm font-bold flex items-center gap-2">
            <PenSquare className="w-4 h-4" /> مقال جديد
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-dark rounded-2xl p-5 border border-gold/10 hover:border-gold/25 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5 text-white/80" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-cairo font-bold px-2 py-1 rounded-lg ${kpi.growth > 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
                }`}>
                {kpi.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(kpi.growth)}%
              </div>
            </div>
            <p className="font-cairo font-bold text-2xl text-white mb-1">{kpi.value}</p>
            <p className="font-cairo text-white/40 text-sm">{kpi.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card-dark rounded-2xl p-6 border border-gold/10"
        >
          <h3 className="font-cairo font-bold text-lg text-white mb-4">المشاهدات والتواصل</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.dailyViews.slice(-14)}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="contactsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a65bb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3a65bb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(v) => v.split('-')[2]} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <Tooltip
                contentStyle={{ background: '#071739', border: '1px solid rgba(197,139,91,0.3)', borderRadius: '12px', fontFamily: 'Cairo' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="views" stroke={GOLD} fill="url(#viewsGrad)" strokeWidth={2} name="مشاهدات" />
              <Area type="monotone" dataKey="contacts" stroke="#3a65bb" fill="url(#contactsGrad)" strokeWidth={2} name="تواصل" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* City Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card-dark rounded-2xl p-6 border border-gold/10"
        >
          <h3 className="font-cairo font-bold text-lg text-white mb-4">المشاهدات حسب المدينة</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.cityViews} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <YAxis dataKey="city" type="category" stroke="rgba(255,255,255,0.3)" fontSize={11} width={100} tick={{ fontFamily: 'Cairo' }} />
              <Tooltip contentStyle={{ background: '#071739', border: '1px solid rgba(197,139,91,0.3)', borderRadius: '12px', fontFamily: 'Cairo' }} />
              <Bar dataKey="views" fill={GOLD} radius={[0, 6, 6, 0]} name="مشاهدات" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card-dark rounded-2xl p-6 border border-gold/10"
        >
          <h3 className="font-cairo font-bold text-lg text-white mb-4">توزيع أنواع العقارات</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {data.typeDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#071739', border: '1px solid rgba(197,139,91,0.3)', borderRadius: '12px', fontFamily: 'Cairo' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {data.typeDistribution.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="font-cairo text-white/50 text-xs">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card-dark rounded-2xl p-6 border border-gold/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cairo font-bold text-lg text-white">آخر الرسائل</h3>
            <Link href="/admin/messages" className="text-gold text-xs font-cairo hover:underline flex items-center gap-1">عرض الكل <ArrowLeft className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {data.recentMessages.slice(0, 4).map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cairo text-white text-sm font-bold truncate">{msg.first_name} {msg.last_name}</p>
                  <p className="font-cairo text-white/40 text-xs truncate">{msg.message}</p>
                </div>
                {msg.status === 'new' && <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-2" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card-dark rounded-2xl p-6 border border-gold/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cairo font-bold text-lg text-white">الأكثر مشاهدة</h3>
            <Link href="/admin/properties" className="text-gold text-xs font-cairo hover:underline flex items-center gap-1">عرض الكل <ArrowLeft className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {data.topProperties.map((prop, i) => (
              <div key={prop.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                <span className="font-cairo font-bold text-gold/60 text-sm w-5">{i + 1}</span>
                <img src={prop.image} alt={prop.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-cairo text-white text-sm font-bold truncate">{prop.name}</p>
                  <p className="font-cairo text-white/40 text-xs flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {prop.views} مشاهدة
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
