'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, Loader2 } from 'lucide-react';

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', cover_image: '',
    category: 'نصائح', tags: '', author: '', status: 'published',
    seo_title: '', seo_description: '',
  });

  const update = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }),
    });
    router.push('/admin/blog');
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"><ArrowRight className="w-5 h-5" /></button>
          <h1 className="font-cairo font-bold text-2xl text-white">مقال جديد</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-gold px-5 py-2 rounded-xl font-cairo text-sm font-bold flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} نشر المقال
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card-dark rounded-2xl p-6 border border-gold/10 space-y-5">
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">عنوان المقال *</label>
              <input value={form.title} onChange={e => update('title', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-lg" placeholder="عنوان مقالك هنا..." />
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">الملخص</label>
              <textarea value={form.excerpt} onChange={e => update('excerpt', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm min-h-[80px] resize-none" placeholder="ملخص قصير للمقال..." />
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">المحتوى *</label>
              <textarea value={form.content} onChange={e => update('content', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm min-h-[300px] resize-y" placeholder="اكتب محتوى المقال هنا..." />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card-dark rounded-2xl p-5 border border-gold/10 space-y-4">
            <h3 className="font-cairo font-bold text-white text-sm">إعدادات النشر</h3>
            <div>
              <label className="block font-cairo text-xs text-white/50 mb-1">الحالة</label>
              <select value={form.status} onChange={e => update('status', e.target.value)} className="w-full input-luxury rounded-lg py-2 px-3 font-cairo text-xs appearance-none">
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
              </select>
            </div>
            <div>
              <label className="block font-cairo text-xs text-white/50 mb-1">التصنيف</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className="w-full input-luxury rounded-lg py-2 px-3 font-cairo text-xs appearance-none">
                <option value="استثمار">استثمار</option>
                <option value="نصائح">نصائح</option>
                <option value="ديكور">ديكور</option>
                <option value="أخبار">أخبار</option>
                <option value="تحليلات">تحليلات</option>
              </select>
            </div>
            <div>
              <label className="block font-cairo text-xs text-white/50 mb-1">الكاتب</label>
              <input value={form.author} onChange={e => update('author', e.target.value)} className="w-full input-luxury rounded-lg py-2 px-3 font-cairo text-xs" placeholder="اسم الكاتب" />
            </div>
            <div>
              <label className="block font-cairo text-xs text-white/50 mb-1">صورة الغلاف</label>
              <input value={form.cover_image} onChange={e => update('cover_image', e.target.value)} className="w-full input-luxury rounded-lg py-2 px-3 font-cairo text-xs text-left" dir="ltr" placeholder="https://..." />
              {form.cover_image && <img src={form.cover_image} alt="" className="mt-2 rounded-lg h-24 w-full object-cover" />}
            </div>
            <div>
              <label className="block font-cairo text-xs text-white/50 mb-1">الوسوم (مفصولة بفاصلة)</label>
              <input value={form.tags} onChange={e => update('tags', e.target.value)} className="w-full input-luxury rounded-lg py-2 px-3 font-cairo text-xs" placeholder="عقارات, استثمار, مصر" />
            </div>
          </div>

          <div className="glass-card-dark rounded-2xl p-5 border border-gold/10 space-y-4">
            <h3 className="font-cairo font-bold text-white text-sm">تحسين محركات البحث</h3>
            <div>
              <label className="block font-cairo text-xs text-white/50 mb-1">عنوان SEO</label>
              <input value={form.seo_title} onChange={e => update('seo_title', e.target.value)} className="w-full input-luxury rounded-lg py-2 px-3 font-cairo text-xs" placeholder="عنوان لمحركات البحث" />
            </div>
            <div>
              <label className="block font-cairo text-xs text-white/50 mb-1">وصف SEO</label>
              <textarea value={form.seo_description} onChange={e => update('seo_description', e.target.value)} className="w-full input-luxury rounded-lg py-2 px-3 font-cairo text-xs min-h-[60px] resize-none" placeholder="وصف مختصر..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
