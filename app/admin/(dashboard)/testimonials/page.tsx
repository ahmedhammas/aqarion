'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Save, User } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: number; client_name: string; client_role?: string; client_avatar?: string;
  content: string; rating: number; is_published: boolean; is_featured: boolean; created_at: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchData = () => {
    fetch('/api/admin/testimonials').then(r => r.json()).then(d => { setTestimonials(d.testimonials || []); setLoading(false); });
  };
  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setIsNew(true);
    setEditModal({ id: 0, client_name: '', client_role: '', client_avatar: '', content: '', rating: 5, is_published: true, is_featured: false, created_at: '' });
  };

  const handleSave = async () => {
    if (!editModal) return;
    const method = isNew ? 'POST' : 'PUT';
    await fetch('/api/admin/testimonials', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editModal) });
    setEditModal(null);
    setIsNew(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('حذف هذا الرأي؟')) return;
    await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const togglePublish = async (t: Testimonial) => {
    await fetch('/api/admin/testimonials', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, is_published: !t.is_published }),
    });
    fetchData();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-cairo font-bold text-2xl text-white">آراء العملاء</h1>
        <button onClick={openNew} className="btn-gold px-4 py-2 rounded-xl font-cairo text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة رأي
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`glass-card-dark rounded-2xl p-5 border transition-all ${t.is_published ? 'border-gold/10' : 'border-white/5 opacity-60'}`}>
            <div className="flex items-start gap-3 mb-3">
              {t.client_avatar ? (
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image src={t.client_avatar} alt={t.client_name} fill sizes="40px" className="rounded-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center"><User className="w-5 h-5 text-gold" /></div>
              )}
              <div>
                <p className="font-cairo font-bold text-white text-sm">{t.client_name}</p>
                <p className="font-cairo text-white/40 text-xs">{t.client_role}</p>
              </div>
            </div>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className={`w-3.5 h-3.5 ${s < t.rating ? 'text-gold fill-gold' : 'text-white/10'}`} />
              ))}
            </div>
            <p className="font-cairo text-white/60 text-xs leading-relaxed mb-4 line-clamp-3">{t.content}</p>
            <div className="flex items-center gap-1 pt-3 border-t border-white/5">
              <button onClick={() => togglePublish(t)} className={`p-1.5 rounded-lg text-xs transition-colors ${t.is_published ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-white/30 hover:bg-white/5'}`}>
                {t.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => { setIsNew(false); setEditModal(t); }} className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/5 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/New Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="glass-card-dark rounded-2xl p-6 border border-gold/20 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-cairo font-bold text-lg text-white">{isNew ? 'إضافة رأي جديد' : 'تعديل الرأي'}</h3>
                <button onClick={() => setEditModal(null)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <input value={editModal.client_name} onChange={e => setEditModal({ ...editModal, client_name: e.target.value })} placeholder="اسم العميل" className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm" />
              <input value={editModal.client_role || ''} onChange={e => setEditModal({ ...editModal, client_role: e.target.value })} placeholder="المسمى الوظيفي" className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm" />
              <input value={editModal.client_avatar || ''} onChange={e => setEditModal({ ...editModal, client_avatar: e.target.value })} placeholder="رابط الصورة" className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm text-left" dir="ltr" />
              <textarea value={editModal.content} onChange={e => setEditModal({ ...editModal, content: e.target.value })} placeholder="نص الرأي" className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm min-h-[80px] resize-none" />
              <div>
                <label className="block font-cairo text-xs text-white/50 mb-1">التقييم</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setEditModal({ ...editModal, rating: s })} className="p-1">
                      <Star className={`w-6 h-6 ${s <= editModal.rating ? 'text-gold fill-gold' : 'text-white/10'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSave} className="btn-gold w-full py-2.5 rounded-xl font-cairo text-sm font-bold flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> حفظ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
