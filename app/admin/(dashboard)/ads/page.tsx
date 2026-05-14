'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Save,
  ExternalLink, Layout, Maximize, Sidebar as SidebarIcon,
  Monitor, Image, Link as LinkIcon, ToggleLeft, ToggleRight, Upload
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Ad {
  id: number;
  title: string;
  image_url: string;
  link: string;
  position: string;
  is_active: boolean;
  created_at: string;
}

const positions = [
  { id: 'home_banner', label: 'بانر رئيسي', icon: Layout, desc: 'يظهر بين الأقسام الرئيسية على الصفحة الرئيسية', color: 'from-blue-500 to-cyan-500' },
  { id: 'popup', label: 'نافذة منبثقة', icon: Maximize, desc: 'يظهر عند دخول الموقع - إعلان بارز', color: 'from-purple-500 to-pink-500' },
  { id: 'sidebar', label: 'شريط جانبي', icon: SidebarIcon, desc: 'إعلان صغير في الشريط الجانبي للصفحات', color: 'from-amber-500 to-orange-500' },
];

const emptyAd = { id: 0, title: '', image_url: '', link: '', position: 'home_banner', is_active: true, created_at: '' };

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<Ad | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [preview, setPreview] = useState<Ad | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ads');
      if (!response.ok) throw new Error('فشل جلب الإعلانات');
      const data = await response.json();
      setAds(data.ads || []);
    } catch (error) {
      console.error('Fetch error:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!editModal || !editModal.title || !editModal.image_url || !editModal.link) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setSaving(true);
    try {
      const method = isNew ? 'POST' : 'PUT';
      const response = await fetch('/api/admin/ads', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editModal),
      });

      if (!response.ok) throw new Error('فشل حفظ الإعلان');

      alert(isNew ? 'تم إضافة الإعلان بنجاح ✓' : 'تم تحديث الإعلان بنجاح ✓');
      setEditModal(null);
      setIsNew(false);
      await fetchData();
    } catch (error) {
      console.error('Save error:', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل تريد حذف هذا الإعلان بالفعل؟')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('فشل الحذف');
      alert('تم حذف الإعلان بنجاح ✓');
      await fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('فشل حذف الإعلان');
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (ad: Ad) => {
    try {
      const response = await fetch('/api/admin/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ad, is_active: !ad.is_active }),
      });
      if (!response.ok) throw new Error('فشل التحديث');
      await fetchData();
    } catch (error) {
      console.error('Toggle error:', error);
      alert('فشل تحديث حالة الإعلان');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editModal) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `ads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ads')
        .getPublicUrl(filePath);

      setEditModal({ ...editModal, image_url: publicUrl });
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('فشل رفع الصورة: تأكد من وجود Bucket باسم ads في Supabase وجعله Public');
    } finally {
      setUploading(false);
    }
  };

  const filtered = activeFilter === 'all' ? ads : ads.filter(a => a.position === activeFilter);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C58B5B' }} /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-cairo font-bold text-2xl text-white">المساحات الإعلانية</h1>
          <p className="font-cairo text-white/40 text-sm mt-1">إدارة الإعلانات في مواضع مختلفة من الموقع</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all font-cairo text-sm">
            <Monitor className="w-4 h-4" /> معاينة الموقع
          </a>
          <button onClick={() => { setIsNew(true); setEditModal({ ...emptyAd }); }} className="btn-gold px-4 py-2 rounded-xl font-cairo text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> إضافة إعلان
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الإعلانات', value: ads.length, color: 'text-white' },
          { label: 'إعلانات نشطة', value: ads.filter(a => a.is_active).length, color: 'text-emerald-400' },
          { label: 'بانر رئيسي', value: ads.filter(a => a.position === 'home_banner').length, color: 'text-blue-400' },
          { label: 'نوافذ منبثقة', value: ads.filter(a => a.position === 'popup').length, color: 'text-purple-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card-dark rounded-2xl p-4 border border-gold/10">
            <p className={`font-cairo font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="font-cairo text-white/40 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {[{ id: 'all', label: 'الكل' }, ...positions.map(p => ({ id: p.id, label: p.label }))].map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)}
            className="px-4 py-2 rounded-lg font-cairo text-xs font-medium transition-all whitespace-nowrap"
            style={activeFilter === f.id
              ? { background: 'linear-gradient(135deg, rgba(197,139,91,0.2), rgba(197,139,91,0.05))', color: '#C58B5B' }
              : { color: 'rgba(255,255,255,0.4)' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Ads Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ad, i) => (
          <motion.div key={ad.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`glass-card-dark rounded-2xl overflow-hidden border transition-all ${ad.is_active ? 'border-gold/15' : 'border-white/5 opacity-60'}`}>
            {/* Image */}
            <div className="relative h-44 group">
              {ad.image_url ? (
                <img 
                  src={ad.image_url} 
                  alt={ad.title} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                  onError={(e: any) => e.target.style.backgroundColor = '#1a1a1a'}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/1">
                  <Image className="w-10 h-10 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => setPreview(ad)} className="p-2 bg-white/10 hover:bg-gold/20 text-white rounded-full transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <a href={ad.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-gold/20 text-white rounded-full transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              {/* Position badge */}
              <div className="absolute top-2 right-2 px-2 py-1 rounded-lg border" style={{ background: 'rgba(0,0,0,0.7)', borderColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <p className="font-cairo text-[10px] font-bold uppercase tracking-wider" style={{ color: '#C58B5B' }}>
                  {positions.find(p => p.id === ad.position)?.label || ad.position}
                </p>
              </div>
              {/* Active indicator */}
              <div className={`absolute top-2 left-2 w-2.5 h-2.5 rounded-full ${ad.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-cairo font-bold text-white text-sm mb-1 truncate">{ad.title || 'بدون عنوان'}</h3>
              <p className="font-cairo text-white/30 text-xs truncate mb-3" dir="ltr">{ad.link}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(ad)}
                    className={`p-1.5 rounded-lg transition-colors text-xs ${ad.is_active ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-white/30 hover:bg-white/5'}`}>
                    {ad.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setIsNew(false); setEditModal({ ...ad }); }}
                    className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/5 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(ad.id)}
                    disabled={deleting === ad.id}
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-colors disabled:opacity-50">
                    {deleting === ad.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
                <span className="font-cairo text-[10px] text-white/20">#{ad.id}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center">
            <Layout className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="font-cairo text-white/30">لا توجد إعلانات في هذه الفئة</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="glass-card-dark rounded-2xl border max-w-lg w-full max-h-[90vh] overflow-y-auto"
              style={{ borderColor: 'rgba(197,139,91,0.2)' }}>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-cairo font-bold text-lg text-white">{isNew ? 'إضافة إعلان جديد' : 'تعديل الإعلان'}</h3>
                  <button onClick={() => setEditModal(null)} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-cairo text-xs text-white/50 mb-1.5">عنوان الإعلان *</label>
                    <input value={editModal.title} onChange={e => setEditModal({ ...editModal, title: e.target.value })}
                      placeholder="مثلاً: عرض الصيف - الساحل الشمالي"
                      className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm" />
                  </div>

                  <div>
                    <label className="block font-cairo text-xs text-white/50 mb-1.5">الصورة الإعلانية *</label>
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <input value={editModal.image_url} onChange={e => setEditModal({ ...editModal, image_url: e.target.value })}
                          placeholder="رابط الصورة أو ارفع واحدة..." className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm text-left" dir="ltr" />
                      </div>
                      <label className="cursor-pointer bg-gold/10 hover:bg-gold/20 text-gold p-2.5 rounded-xl border border-gold/20 transition-all flex items-center justify-center min-w-[45px]">
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                      </label>
                    </div>
                    {editModal.image_url && (
                      <div className="mt-2 rounded-xl overflow-hidden h-32 bg-gray-900 border border-white/5">
                        <img 
                          src={editModal.image_url} 
                          alt="preview" 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                          onError={(e: any) => e.target.style.display = 'none'} 
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-cairo text-xs text-white/50 mb-1.5">رابط الوجهة *</label>
                    <input value={editModal.link} onChange={e => setEditModal({ ...editModal, link: e.target.value })}
                      placeholder="/properties/..." className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm text-left" dir="ltr" />
                  </div>

                  <div>
                    <label className="block font-cairo text-xs text-white/50 mb-2">مكان الظهور *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {positions.map(p => (
                        <button key={p.id} onClick={() => setEditModal({ ...editModal, position: p.id })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all`}
                          style={editModal.position === p.id
                            ? { borderColor: '#C58B5B', background: 'rgba(197,139,91,0.1)', color: '#C58B5B' }
                            : { borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                          <p.icon className="w-5 h-5" />
                          <span className="font-cairo text-[10px] text-center">{p.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="font-cairo text-white/30 text-xs mt-2">
                      📍 {positions.find(p => p.id === editModal.position)?.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="font-cairo text-white text-sm">تفعيل الإعلان</span>
                    <button onClick={() => setEditModal({ ...editModal, is_active: !editModal.is_active })}
                      className="relative w-11 h-6 rounded-full transition-all"
                      style={editModal.is_active ? { background: 'linear-gradient(135deg, #C58B5B, #d4a76a)' } : { background: 'rgba(255,255,255,0.1)' }}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${editModal.is_active ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="btn-gold w-full py-3 rounded-xl font-cairo text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'جاري الحفظ...' : 'حفظ الإعلان'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setPreview(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setPreview(null)} 
                className="absolute -top-4 -right-4 z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="rounded-2xl overflow-hidden border bg-gray-900" style={{ borderColor: 'rgba(197,139,91,0.2)' }}>
                <img 
                  src={preview.image_url} 
                  alt={preview.title} 
                  className="w-full object-cover max-h-96" 
                  loading="lazy"
                  onError={(e: any) => e.target.style.backgroundColor = '#1a1a1a'}
                />
                <div className="p-4" style={{ background: '#020a18' }}>
                  <p className="font-cairo text-white font-bold mb-1">{preview.title}</p>
                  <p className="font-cairo text-white/50 text-xs mb-3">📍 {positions.find(p => p.id === preview.position)?.label}</p>
                  <a 
                    href={preview.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-all text-xs font-cairo font-bold"
                  >
                    زيارة الرابط
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
