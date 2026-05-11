'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save, ArrowRight, Building2, MapPin, DollarSign, Info, Image, Settings, Loader2,
  BedDouble, Bath, Maximize, Calendar, Layers
} from 'lucide-react';

const tabs = [
  { id: 'basic', label: 'المعلومات الأساسية', icon: Building2 },
  { id: 'details', label: 'التفاصيل', icon: Info },
  { id: 'media', label: 'الصور والوسائط', icon: Image },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

const amenitiesList = [
  'مسبح خاص', 'حديقة', 'جراج', 'تراس', 'نظام أمان ذكي', 'تكييف مركزي',
  'مصعد', 'أمن 24 ساعة', 'نادي رياضي', 'حمام سباحة مشترك', 'مساحات خضراء',
  'غرفة خادمة', 'بدروم', 'جاكوزي', 'غرفة سينما', 'إنتركم', 'إنترنت فائق السرعة',
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', name_en: '', city: 'القاهرة', location: '', district: '',
    priceNum: 0, price: '', type: 'villa', typeLabel: 'فيلا',
    listingType: 'sale', status: 'available',
    bedrooms: 3, bathrooms: 2, area: 150, floor: 0, yearBuilt: 2024,
    description: '', amenities: [] as string[],
    image: '', images: [] as string[], tag: '',
    featured: false, video_url: '', virtual_tour_url: '',
  });

  const updateForm = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleTypeChange = (type: string) => {
    const labels: Record<string, string> = { villa: 'فيلا', apartment: 'شقة', compound: 'كمبوند', office: 'مكتب', townhouse: 'تاون هاوس' };
    updateForm('type', type);
    updateForm('typeLabel', labels[type] || type);
  };

  const handleSave = async (publish = true) => {
    setSaving(true);
    try {
      await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, is_published: publish }),
      });
      router.push('/admin/properties');
    } catch {
      alert('حدث خطأ أثناء الحفظ');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-cairo font-bold text-2xl text-white">إضافة عقار جديد</h1>
            <p className="font-cairo text-white/50 text-sm">أدخل بيانات العقار بالكامل</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave(false)} className="btn-outline-gold px-4 py-2 rounded-xl font-cairo text-sm font-bold hidden md:flex items-center gap-2">
            حفظ كمسودة
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="btn-gold px-5 py-2 rounded-xl font-cairo text-sm font-bold flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            نشر العقار
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.02] p-1 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-cairo text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gold/15 text-gold' : 'text-white/50 hover:text-white'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-dark rounded-2xl p-6 border border-gold/10">

        {activeTab === 'basic' && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">اسم العقار (عربي) *</label>
                <input value={form.name} onChange={e => updateForm('name', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm" placeholder="فيلا الساحل الشمالي الفاخرة" />
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">اسم العقار (إنجليزي)</label>
                <input value={form.name_en} onChange={e => updateForm('name_en', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left" dir="ltr" placeholder="Luxury North Coast Villa" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">المدينة *</label>
                <select value={form.city} onChange={e => updateForm('city', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none">
                  <option value="القاهرة">القاهرة</option>
                  <option value="الشيخ زايد">الشيخ زايد</option>
                  <option value="الساحل الشمالي">الساحل الشمالي</option>
                  <option value="6 أكتوبر">6 أكتوبر</option>
                  <option value="العاصمة الإدارية">العاصمة الإدارية</option>
                </select>
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">الموقع التفصيلي *</label>
                <input value={form.location} onChange={e => updateForm('location', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm" placeholder="التجمع الخامس، شارع التسعين" />
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">الحي</label>
                <input value={form.district} onChange={e => updateForm('district', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm" placeholder="الحي الثالث" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">السعر (رقمي) *</label>
                <input type="number" value={form.priceNum} onChange={e => updateForm('priceNum', parseInt(e.target.value) || 0)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left" dir="ltr" />
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">السعر (عرض) *</label>
                <input value={form.price} onChange={e => updateForm('price', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm" placeholder="٧٫٥ مليون" />
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">نوع العقار *</label>
                <select value={form.type} onChange={e => handleTypeChange(e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none">
                  <option value="villa">فيلا</option>
                  <option value="apartment">شقة</option>
                  <option value="compound">كمبوند</option>
                  <option value="office">مكتب</option>
                  <option value="townhouse">تاون هاوس</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">نوع الإدراج</label>
                <select value={form.listingType} onChange={e => updateForm('listingType', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none">
                  <option value="sale">للبيع</option>
                  <option value="rent">للإيجار</option>
                  <option value="both">بيع وإيجار</option>
                </select>
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">الحالة</label>
                <select value={form.status} onChange={e => updateForm('status', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none">
                  <option value="available">متاح</option>
                  <option value="sold">مباع</option>
                  <option value="rented">مؤجر</option>
                  <option value="reserved">محجوز</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2"><BedDouble className="w-4 h-4 inline ml-1" />غرف النوم</label>
                <input type="number" value={form.bedrooms} onChange={e => updateForm('bedrooms', parseInt(e.target.value) || 0)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-center" />
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2"><Bath className="w-4 h-4 inline ml-1" />الحمامات</label>
                <input type="number" value={form.bathrooms} onChange={e => updateForm('bathrooms', parseInt(e.target.value) || 0)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-center" />
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2"><Maximize className="w-4 h-4 inline ml-1" />المساحة (م²)</label>
                <input type="number" value={form.area} onChange={e => updateForm('area', parseInt(e.target.value) || 0)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-center" />
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2"><Layers className="w-4 h-4 inline ml-1" />الطابق</label>
                <input type="number" value={form.floor} onChange={e => updateForm('floor', parseInt(e.target.value) || 0)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-center" />
              </div>
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2"><Calendar className="w-4 h-4 inline ml-1" />سنة البناء</label>
              <input type="number" value={form.yearBuilt} onChange={e => updateForm('yearBuilt', parseInt(e.target.value) || 2024)} className="w-full md:w-48 input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-center" />
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">الوصف</label>
              <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm min-h-[150px] resize-none" placeholder="اكتب وصفاً تفصيلياً للعقار..." />
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-3">المميزات والخدمات</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {amenitiesList.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`py-2 px-3 rounded-xl font-cairo text-xs font-medium transition-all border ${form.amenities.includes(amenity)
                        ? 'bg-gold/15 text-gold border-gold/30'
                        : 'bg-white/[0.02] text-white/50 border-white/5 hover:border-gold/20'
                      }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-5">
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">رابط الصورة الرئيسية *</label>
              <input value={form.image} onChange={e => updateForm('image', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left" dir="ltr" placeholder="https://images.pexels.com/..." />
              {form.image && <img src={form.image} alt="Preview" className="mt-3 h-40 rounded-xl object-cover" />}
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">صور إضافية (سطر لكل رابط)</label>
              <textarea
                value={form.images.join('\n')}
                onChange={e => updateForm('images', e.target.value.split('\n').filter(Boolean))}
                className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm min-h-[100px] text-left" dir="ltr"
                placeholder="https://images.pexels.com/photo1.jpg&#10;https://images.pexels.com/photo2.jpg"
              />
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">رابط فيديو يوتيوب</label>
              <input value={form.video_url} onChange={e => updateForm('video_url', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left" dir="ltr" placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">رابط جولة افتراضية</label>
              <input value={form.virtual_tour_url} onChange={e => updateForm('virtual_tour_url', e.target.value)} className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left" dir="ltr" placeholder="https://..." />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <p className="font-cairo text-white text-sm font-bold">تمييز العقار</p>
                <p className="font-cairo text-white/40 text-xs">عرض العقار في قسم المميز على الصفحة الرئيسية</p>
              </div>
              <button
                onClick={() => updateForm('featured', !form.featured)}
                className={`w-12 h-6 rounded-full transition-all ${form.featured ? 'bg-gold' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${form.featured ? '-translate-x-6' : '-translate-x-0.5'}`} />
              </button>
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">Tag / وسم</label>
              <select value={form.tag} onChange={e => updateForm('tag', e.target.value)} className="w-full md:w-64 input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none">
                <option value="">بدون وسم</option>
                <option value="مميز">مميز</option>
                <option value="جديد">جديد</option>
                <option value="حصري">حصري</option>
                <option value="فاخر">فاخر</option>
              </select>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
