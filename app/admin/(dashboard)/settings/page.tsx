'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Loader2, Globe, Phone, MapPin, Bell, Brain, Shield,
  Lock, Mail, Eye, EyeOff, User, CheckCircle, XCircle, Upload,
  AlertTriangle, Settings, Key, RefreshCw
} from 'lucide-react';

interface Settings {
  site_name: string;
  site_tagline: string;
  site_logo: string;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  address: string;
  announcement_text: string;
  announcement_active: string;
  properties_per_page: string;
  openai_model: string;
}

const tabs = [
  { id: 'general', label: 'عام', icon: Globe },
  { id: 'contact', label: 'التواصل', icon: Phone },
  { id: 'marketing', label: 'التسويق', icon: Bell },
  { id: 'ai', label: 'الذكاء الاصطناعي', icon: Brain },
  { id: 'security', label: 'الأمان', icon: Shield },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Security state
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({ full_name: '', avatar_url: '' });
  const [pwForm, setPwForm] = useState({ current: '', new_password: '', confirm: '' });
  const [emailForm, setEmailForm] = useState({ new_email: '', password: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [secLoading, setSecLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      setSettings(d.settings);
      setLoading(false);
    });
    fetch('/api/admin/auth').then(r => r.json()).then(d => {
      if (d.admin) {
        setAdminInfo(d.admin);
        setProfileForm({ full_name: d.admin.full_name, avatar_url: d.admin.avatar_url || '' });
        setEmailForm(f => ({ ...f, new_email: d.admin.email }));
      }
    }).catch(() => {});
  }, []);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const update = (key: string, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        showFeedback('success', 'تم حفظ الإعدادات بنجاح');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      showFeedback('error', 'فشل حفظ الإعدادات');
    }
    setSaving(false);
  };

  const handleUpdateProfile = async () => {
    setSecLoading(true);
    const res = await fetch('/api/admin/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_profile', ...profileForm }),
    });
    const data = await res.json();
    if (res.ok) showFeedback('success', data.message);
    else showFeedback('error', data.error);
    setSecLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setSaving(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Math.random()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setSettings({ ...settings, site_logo: publicUrl });
      showFeedback('success', 'تم رفع اللوجو بنجاح، لا تنسى الحفظ');
    } catch (error: any) {
      console.error('Upload error:', error);
      showFeedback('error', 'فشل رفع الصورة. تأكد من وجود bucket باسم images');
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (pwForm.new_password !== pwForm.confirm) {
      showFeedback('error', 'كلمة المرور الجديدة وتأكيدها غير متطابقان');
      return;
    }
    if (pwForm.new_password.length < 6) {
      showFeedback('error', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setSecLoading(true);
    const res = await fetch('/api/admin/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change_password', current_password: pwForm.current, new_password: pwForm.new_password }),
    });
    const data = await res.json();
    if (res.ok) {
      showFeedback('success', data.message);
      setPwForm({ current: '', new_password: '', confirm: '' });
    } else {
      showFeedback('error', data.error);
    }
    setSecLoading(false);
  };

  const handleChangeEmail = async () => {
    if (!emailForm.new_email || !emailForm.password) {
      showFeedback('error', 'البريد الإلكتروني وكلمة المرور مطلوبان');
      return;
    }
    setSecLoading(true);
    const res = await fetch('/api/admin/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change_email', ...emailForm }),
    });
    const data = await res.json();
    if (res.ok) showFeedback('success', data.message);
    else showFeedback('error', data.error);
    setSecLoading(false);
  };

  if (loading || !settings) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C58B5B' }} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cairo font-bold text-2xl text-white">إعدادات الموقع</h1>
          <p className="font-cairo text-white/40 text-sm mt-1">تحكم كامل في إعدادات المنصة والأمان</p>
        </div>
        {activeTab !== 'security' && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold px-5 py-2.5 rounded-xl font-cairo text-sm font-bold flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}
          </button>
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              feedback.type === 'success'
                ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
                : 'bg-red-400/10 border-red-400/30 text-red-400'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="font-cairo text-sm">{feedback.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-cairo text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
            style={activeTab === tab.id ? {
              background: 'linear-gradient(135deg, rgba(197,139,91,0.2), rgba(197,139,91,0.05))',
              color: '#C58B5B',
            } : {}}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-dark rounded-2xl p-6 border border-gold/10"
      >
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-5">
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">اسم الموقع</label>
                  <input
                    value={settings.site_name}
                    onChange={e => update('site_name', e.target.value)}
                    className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm"
                  />
                </div>
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">وصف الموقع / الشعار</label>
                  <input
                    value={settings.site_tagline}
                    onChange={e => update('site_tagline', e.target.value)}
                    className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm"
                  />
                </div>
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">عدد العقارات في الصفحة</label>
                  <input
                    type="number"
                    min="3"
                    max="24"
                    value={settings.properties_per_page}
                    onChange={e => update('properties_per_page', e.target.value)}
                    className="w-32 input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-center"
                  />
                </div>
              </div>
              <div className="w-full md:w-64 space-y-3">
                <label className="block font-cairo text-sm text-white/60">لوجو الموقع</label>
                <div
                  className="relative group aspect-square rounded-2xl overflow-hidden flex items-center justify-center p-4 border transition-all hover:border-gold/30 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  {settings.site_logo ? (
                    <>
                      <img src={settings.site_logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
                      <p className="text-white/20 text-xs font-cairo">رفع شعار جديد</p>
                    </div>
                  )}
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
                <input
                  value={settings.site_logo}
                  onChange={e => update('site_logo', e.target.value)}
                  placeholder="أو ضع رابط اللوجو هنا"
                  className="w-full input-luxury rounded-xl py-2.5 px-3 font-cairo text-xs text-left"
                  dir="ltr"
                />
                <p className="font-cairo text-white/30 text-[10px]">يمكنك الرفع مباشرة أو وضع رابط خارجي</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">رقم الهاتف</label>
                <input
                  value={settings.phone_number}
                  onChange={e => update('phone_number', e.target.value)}
                  className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block font-cairo text-sm text-white/60 mb-2">رقم واتساب</label>
                <input
                  value={settings.whatsapp_number}
                  onChange={e => update('whatsapp_number', e.target.value)}
                  className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">البريد الإلكتروني</label>
              <input
                value={settings.email}
                onChange={e => update('email', e.target.value)}
                className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">العنوان</label>
              <input
                value={settings.address}
                onChange={e => update('address', e.target.value)}
                className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm"
              />
            </div>
          </div>
        )}

        {/* Marketing Tab */}
        {activeTab === 'marketing' && (
          <div className="space-y-5">
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">نص شريط الإعلانات</label>
              <input
                value={settings.announcement_text}
                onChange={e => update('announcement_text', e.target.value)}
                className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm"
                placeholder="مثلاً: عروض حصرية على فيلل الساحل الشمالي..."
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-xl border"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <div>
                <p className="font-cairo text-white text-sm font-bold">تفعيل شريط الإعلانات</p>
                <p className="font-cairo text-white/40 text-xs">عرض شريط الإعلانات في أعلى الموقع</p>
              </div>
              <button
                onClick={() => update('announcement_active', settings.announcement_active === 'true' ? 'false' : 'true')}
                className={`relative w-12 h-6 rounded-full transition-all`}
                style={settings.announcement_active === 'true'
                  ? { background: 'linear-gradient(135deg, #C58B5B, #d4a76a)' }
                  : { background: 'rgba(255,255,255,0.1)' }
                }
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${
                    settings.announcement_active === 'true' ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div
              className="p-4 rounded-xl border"
              style={{ background: 'rgba(197,139,91,0.05)', borderColor: 'rgba(197,139,91,0.15)' }}
            >
              <p className="font-cairo text-xs font-bold mb-1" style={{ color: '#C58B5B' }}>📢 معاينة الشريط الإعلاني</p>
              <div
                className="rounded-lg py-2 px-4 text-center font-cairo text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #C58B5B, #d4a76a)' }}
              >
                {settings.announcement_text || 'نص الإعلان سيظهر هنا...'}
              </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-5">
            <div>
              <label className="block font-cairo text-sm text-white/60 mb-2">نموذج الذكاء الاصطناعي</label>
              <select
                value={settings.openai_model}
                onChange={e => update('openai_model', e.target.value)}
                className="w-full md:w-72 input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none"
              >
                <option value="gpt-4o-mini">GPT-4o Mini (سريع وموفر)</option>
                <option value="gpt-4o">GPT-4o (الأقوى)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (اقتصادي)</option>
              </select>
            </div>
            <div
              className="p-4 rounded-xl border"
              style={{ background: 'rgba(197,139,91,0.05)', borderColor: 'rgba(197,139,91,0.15)' }}
            >
              <p className="font-cairo font-bold mb-1 text-sm" style={{ color: '#C58B5B' }}>💡 ملاحظة</p>
              <p className="font-cairo text-white/50 text-xs">
                المساعد الذكي يستخدم هذا النموذج للرد على استفسارات العملاء. GPT-4o Mini يوفر أفضل توازن بين الجودة والتكلفة.
              </p>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Admin Profile */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5" style={{ color: '#C58B5B' }} />
                <h3 className="font-cairo font-bold text-white">الملف الشخصي</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">الاسم الكامل</label>
                  <input
                    value={profileForm.full_name}
                    onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    placeholder="مثلاً: مدير النظام"
                    className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm"
                  />
                </div>
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">رابط الصورة الشخصية</label>
                  <input
                    value={profileForm.avatar_url}
                    onChange={e => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left"
                    dir="ltr"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={secLoading}
                  className="btn-gold px-5 py-2.5 rounded-xl font-cairo text-sm font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {secLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  حفظ الملف الشخصي
                </button>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5" style={{ color: '#C58B5B' }} />
                <h3 className="font-cairo font-bold text-white">تغيير البريد الإلكتروني</h3>
              </div>
              <div
                className="p-3 rounded-xl border mb-4 flex items-start gap-2"
                style={{ background: 'rgba(251,191,36,0.05)', borderColor: 'rgba(251,191,36,0.2)' }}
              >
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="font-cairo text-yellow-400/80 text-xs">
                  تغيير البريد الإلكتروني سيؤثر على بيانات تسجيل الدخول في المرة القادمة.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">البريد الإلكتروني الجديد</label>
                  <input
                    type="email"
                    value={emailForm.new_email}
                    onChange={e => setEmailForm({ ...emailForm, new_email: e.target.value })}
                    className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">كلمة المرور الحالية للتأكيد</label>
                  <input
                    type="password"
                    value={emailForm.password}
                    onChange={e => setEmailForm({ ...emailForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left"
                    dir="ltr"
                  />
                </div>
                <button
                  onClick={handleChangeEmail}
                  disabled={secLoading}
                  className="btn-outline-gold px-5 py-2.5 rounded-xl font-cairo text-sm font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {secLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  تحديث البريد الإلكتروني
                </button>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5" style={{ color: '#C58B5B' }} />
                <h3 className="font-cairo font-bold text-white">تغيير كلمة المرور</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'current', label: 'كلمة المرور الحالية', showKey: 'current' as const },
                  { key: 'new_password', label: 'كلمة المرور الجديدة', showKey: 'new' as const },
                  { key: 'confirm', label: 'تأكيد كلمة المرور الجديدة', showKey: 'confirm' as const },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block font-cairo text-sm text-white/60 mb-2">{field.label}</label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type={showPw[field.showKey] ? 'text' : 'password'}
                        value={pwForm[field.key as keyof typeof pwForm]}
                        onChange={e => setPwForm({ ...pwForm, [field.key]: e.target.value })}
                        placeholder="••••••••"
                        className="w-full input-luxury rounded-xl py-3 pr-10 pl-10 font-cairo text-sm text-left"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw({ ...showPw, [field.showKey]: !showPw[field.showKey] })}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showPw[field.showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Password strength indicator */}
                {pwForm.new_password && (
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(level => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full transition-all"
                          style={{
                            background: level <= (
                              pwForm.new_password.length >= 12 ? 4 :
                              pwForm.new_password.length >= 8 ? 3 :
                              pwForm.new_password.length >= 6 ? 2 : 1
                            )
                              ? level === 1 ? '#ef4444' : level === 2 ? '#f59e0b' : level === 3 ? '#3b82f6' : '#10b981'
                              : 'rgba(255,255,255,0.1)'
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-cairo text-white/30 text-xs">
                      {pwForm.new_password.length < 6 ? 'ضعيفة جداً' :
                       pwForm.new_password.length < 8 ? 'ضعيفة' :
                       pwForm.new_password.length < 12 ? 'جيدة' : 'قوية جداً'}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleChangePassword}
                  disabled={secLoading}
                  className="btn-gold px-5 py-2.5 rounded-xl font-cairo text-sm font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {secLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  تغيير كلمة المرور
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
