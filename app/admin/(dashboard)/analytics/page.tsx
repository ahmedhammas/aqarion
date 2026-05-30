'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Eye, Users, MousePointer, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#C58B5B', '#3a65bb', '#d4a76a', '#6d8dd4', '#a5713d'];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30');

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  if (!data) return null;

  const totalViews = data.dailyViews?.reduce((s: number, d: any) => s + d.views, 0) || 0;
  const totalContacts = data.dailyViews?.reduce((s: number, d: any) => s + d.contacts, 0) || 0;
  const avgDaily = Math.round(totalViews / (data.dailyViews?.length || 1));
  const conversionRate = totalViews > 0 ? ((totalContacts / totalViews) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-cairo font-bold text-2xl text-white">التحليلات والإحصاءات</h1>
        <div className="flex gap-1 bg-white/[0.02] p-1 rounded-xl">
          {[{ v: '7', l: '7 أيام' }, { v: '30', l: '30 يوم' }, { v: '90', l: '90 يوم' }].map(r => (
            <button key={r.v} onClick={() => setRange(r.v)} className={`px-4 py-1.5 rounded-lg font-cairo text-xs transition-all ${range === r.v ? 'bg-gold/15 text-gold' : 'text-white/40'}`}>
              {r.l}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المشاهدات', value: totalViews.toLocaleString('ar-EG'), icon: Eye, color: 'text-gold' },
          { label: 'إجمالي التواصل', value: totalContacts, icon: Users, color: 'text-blue-400' },
          { label: 'متوسط يومي', value: avgDaily, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'معدل التحويل', value: `${conversionRate}%`, icon: MousePointer, color: 'text-purple-400' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card-dark rounded-2xl p-5 border border-gold/10">
            <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
            <p className="font-cairo font-bold text-2xl text-white">{card.value}</p>
            <p className="font-cairo text-white/40 text-xs">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Views */}
        <div className="glass-card-dark rounded-2xl p-6 border border-gold/10">
          <h3 className="font-cairo font-bold text-lg text-white mb-4">المشاهدات اليومية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dailyViews?.slice(-parseInt(range))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(v: string) => v.split('-')[2]} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <Tooltip contentStyle={{ background: '#071739', border: '1px solid rgba(197,139,91,0.3)', borderRadius: '12px', fontFamily: 'Cairo' }} />
              <Line type="monotone" dataKey="views" stroke="#C58B5B" strokeWidth={2} dot={false} name="مشاهدات" />
              <Line type="monotone" dataKey="contacts" stroke="#3a65bb" strokeWidth={2} dot={false} name="تواصل" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* City Views */}
        <div className="glass-card-dark rounded-2xl p-6 border border-gold/10">
          <h3 className="font-cairo font-bold text-lg text-white mb-4">المشاهدات حسب المدينة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.cityViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="city" stroke="rgba(255,255,255,0.3)" fontSize={11} tick={{ fontFamily: 'Cairo' }} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <Tooltip contentStyle={{ background: '#071739', border: '1px solid rgba(197,139,91,0.3)', borderRadius: '12px', fontFamily: 'Cairo' }} />
              <Bar dataKey="views" fill="#C58B5B" radius={[6, 6, 0, 0]} name="مشاهدات" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Type Distribution */}
        <div className="glass-card-dark rounded-2xl p-6 border border-gold/10">
          <h3 className="font-cairo font-bold text-lg text-white mb-4">توزيع أنواع العقارات</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.typeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {data.typeDistribution?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#071739', border: '1px solid rgba(197,139,91,0.3)', borderRadius: '12px', fontFamily: 'Cairo' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {data.typeDistribution?.map((item: any, i: number) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="font-cairo text-white/50 text-xs">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="glass-card-dark rounded-2xl p-6 border border-gold/10">
          <h3 className="font-cairo font-bold text-lg text-white mb-4">مصادر الزيارات</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.sourceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {data.sourceDistribution?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#071739', border: '1px solid rgba(197,139,91,0.3)', borderRadius: '12px', fontFamily: 'Cairo' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {data.sourceDistribution?.map((item: any, i: number) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="font-cairo text-white/50 text-xs">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
