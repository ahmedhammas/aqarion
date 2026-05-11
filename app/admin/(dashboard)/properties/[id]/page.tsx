'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Save, Loader2, Trash2 } from 'lucide-react';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/properties/${params.id}`)
      .then(r => r.json())
      .then(d => { setForm(d.property); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  const updateForm = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/admin/properties/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/admin/properties');
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  if (!form) return <div className="text-center py-20 font-cairo text-white/50">العقار غير موجود</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"><ArrowRight className="w-5 h-5" /></button>
          <div>
            <h1 className="font-cairo font-bold text-2xl text-white">تعديل العقار</h1>
            <p className="font-cairo text-white/50 text-sm">{form.name}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-gold px-5 py-2 rounded-xl font-cairo text-sm font-bold flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} حفظ التعديلات
        </button>
      </div>

      <div className="glass-card-dark rounded-2xl p-6 border border-gold/10 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block font-cairo text-sm text-white/60 mb-2">اسم العقار</label>
            <input value={form.name || ''} onChange={e => updateForm('name', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm" />
          </div>
          <div>
            <label className="block font-cairo text-sm text-white/60 mb-2">المدينة</label>
            <select value={form.city || ''} onChange={e => updateForm('city', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none">
              <option value="القاهرة">القاهرة</option><option value="الشيخ زايد">الشيخ زايد</option>
              <option value="الساحل الشمالي">الساحل الشمالي</option><option value="6 أكتوبر">6 أكتوبر</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block font-cairo text-sm text-white/60 mb-2">السعر (عرض)</label>
            <input value={form.price || ''} onChange={e => updateForm('price', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm" />
          </div>
          <div>
            <label className="block font-cairo text-sm text-white/60 mb-2">السعر (رقمي)</label>
            <input type="number" value={form.priceNum || 0} onChange={e => updateForm('priceNum', parseInt(e.target.value) || 0)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left" dir="ltr" />
          </div>
          <div>
            <label className="block font-cairo text-sm text-white/60 mb-2">الحالة</label>
            <select value={form.status || 'available'} onChange={e => updateForm('status', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none">
              <option value="available">متاح</option><option value="sold">مباع</option>
              <option value="rented">مؤجر</option><option value="reserved">محجوز</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block font-cairo text-sm text-white/60 mb-2">غرف النوم</label>
            <input type="number" value={form.bedrooms || 0} onChange={e => updateForm('bedrooms', parseInt(e.target.value))} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-center" />
          </div>
          <div>
            <label className="block font-cairo text-sm text-white/60 mb-2">الحمامات</label>
            <input type="number" value={form.bathrooms || 0} onChange={e => updateForm('bathrooms', parseInt(e.target.value))} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-center" />
          </div>
          <div>
            <label className="block font-cairo text-sm text-white/60 mb-2">المساحة (م²)</label>
            <input type="number" value={form.area || 0} onChange={e => updateForm('area', parseInt(e.target.value))} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-center" />
          </div>
        </div>
        <div>
          <label className="block font-cairo text-sm text-white/60 mb-2">الوصف</label>
          <textarea value={form.description || ''} onChange={e => updateForm('description', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm min-h-[120px] resize-none" />
        </div>
        <div>
          <label className="block font-cairo text-sm text-white/60 mb-2">الموقع</label>
          <input value={form.location || ''} onChange={e => updateForm('location', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div>
            <p className="font-cairo text-white text-sm font-bold">تمييز العقار</p>
            <p className="font-cairo text-white/40 text-xs">عرض في قسم المميز</p>
          </div>
          <button onClick={() => updateForm('featured', !form.featured)}
            className={`w-12 h-6 rounded-full transition-all ${form.featured ? 'bg-gold' : 'bg-white/10'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${form.featured ? '-translate-x-6' : '-translate-x-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
