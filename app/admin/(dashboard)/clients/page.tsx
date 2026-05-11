'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Search, Edit, Trash2, Loader2, X, Save,
  Mail, Phone, Users, CheckCircle, XCircle, Eye, EyeOff
} from 'lucide-react';

interface Client {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  notes: string;
  created_at: string;
}

const emptyClient = {
  id: '',
  email: '',
  full_name: '',
  phone: '',
  role: 'client',
  is_active: true,
  notes: '',
  created_at: '',
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Partial<Client> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchClients = () => {
    fetch('/api/admin/clients')
      .then(r => r.json())
      .then(d => { setClients(d.clients || []); setLoading(false); });
  };

  useEffect(() => { fetchClients(); }, []);

  const filtered = clients.filter(c =>
    c.full_name.includes(search) || c.email.includes(search) || c.phone.includes(search)
  );

  const handleSave = async () => {
    if (!modal?.email || !modal?.full_name) {
      setError('الاسم والبريد الإلكتروني مطلوبان');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/clients', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modal),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'حدث خطأ');
      } else {
        setSuccess(isNew ? 'تم إنشاء الحساب بنجاح' : 'تم التحديث بنجاح');
        setModal(null);
        fetchClients();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;
    await fetch(`/api/admin/clients?id=${id}`, { method: 'DELETE' });
    fetchClients();
  };

  const toggleActive = async (client: Client) => {
    await fetch('/api/admin/clients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...client, is_active: !client.is_active }),
    });
    fetchClients();
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C58B5B' }} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-cairo font-bold text-2xl text-white">حسابات العملاء</h1>
          <p className="font-cairo text-white/40 text-sm mt-1">إدارة حسابات العملاء المسجلين في المنصة</p>
        </div>
        <button
          onClick={() => { setIsNew(true); setModal({ ...emptyClient }); setError(''); }}
          className="btn-gold px-5 py-2.5 rounded-xl font-cairo text-sm font-bold flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          إنشاء حساب جديد
        </button>
      </div>

      {/* Success */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl border"
            style={{ background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)' }}
          >
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <p className="font-cairo text-emerald-400 text-sm">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'إجمالي العملاء', value: clients.length, color: 'text-white' },
          { label: 'نشط', value: clients.filter(c => c.is_active).length, color: 'text-emerald-400' },
          { label: 'غير نشط', value: clients.filter(c => !c.is_active).length, color: 'text-red-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-dark rounded-2xl p-5 border border-gold/10"
          >
            <Users className="w-5 h-5 mb-2" style={{ color: '#C58B5B' }} />
            <p className={`font-cairo font-bold text-2xl ${stat.color}`}>{stat.value}</p>
            <p className="font-cairo text-white/40 text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="البحث باسم العميل أو البريد أو الهاتف..."
          className="w-full input-luxury rounded-xl py-3 pr-11 pl-4 font-cairo text-sm"
        />
      </div>

      {/* Clients Table */}
      <div className="glass-card-dark rounded-2xl border border-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-right px-6 py-4 font-cairo text-xs font-bold text-white/40">العميل</th>
                <th className="text-right px-6 py-4 font-cairo text-xs font-bold text-white/40">البريد الإلكتروني</th>
                <th className="text-right px-6 py-4 font-cairo text-xs font-bold text-white/40">الهاتف</th>
                <th className="text-right px-6 py-4 font-cairo text-xs font-bold text-white/40">الحالة</th>
                <th className="text-right px-6 py-4 font-cairo text-xs font-bold text-white/40">تاريخ الإنشاء</th>
                <th className="text-left px-6 py-4 font-cairo text-xs font-bold text-white/40">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((client, i) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-cairo font-bold text-sm flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(197,139,91,0.3), rgba(197,139,91,0.1))' }}
                      >
                        {client.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-cairo text-white text-sm font-bold">{client.full_name}</p>
                        {client.notes && <p className="font-cairo text-white/30 text-xs truncate max-w-[150px]">{client.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-cairo text-white/60 text-sm" dir="ltr">{client.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-cairo text-white/60 text-sm" dir="ltr">{client.phone || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-cairo font-bold ${
                      client.is_active
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : 'bg-red-400/10 text-red-400'
                    }`}>
                      {client.is_active ? (
                        <><CheckCircle className="w-3 h-3" /> نشط</>
                      ) : (
                        <><XCircle className="w-3 h-3" /> معطل</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-cairo text-white/40 text-xs">
                      {new Date(client.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => toggleActive(client)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          client.is_active
                            ? 'text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-400/10'
                            : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                        }`}
                        title={client.is_active ? 'تعطيل' : 'تفعيل'}
                      >
                        {client.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => { setIsNew(false); setModal({ ...client }); setError(''); }}
                        className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/5 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="font-cairo text-white/30 text-sm">لا يوجد عملاء مطابقون</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="glass-card-dark rounded-2xl p-6 border max-w-md w-full space-y-4"
              style={{ borderColor: 'rgba(197,139,91,0.2)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-cairo font-bold text-lg text-white">
                  {isNew ? 'إنشاء حساب عميل جديد' : 'تعديل حساب العميل'}
                </h3>
                <button onClick={() => setModal(null)} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-400/10 border border-red-400/20">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="font-cairo text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">الاسم الكامل *</label>
                  <input
                    value={modal.full_name || ''}
                    onChange={e => setModal({ ...modal, full_name: e.target.value })}
                    placeholder="مثلاً: أحمد محمد"
                    className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm"
                  />
                </div>
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">البريد الإلكتروني *</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={modal.email || ''}
                      onChange={e => setModal({ ...modal, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full input-luxury rounded-xl py-3 pr-10 pl-4 font-cairo text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      value={modal.phone || ''}
                      onChange={e => setModal({ ...modal, phone: e.target.value })}
                      placeholder="+201012345678"
                      className="w-full input-luxury rounded-xl py-3 pr-10 pl-4 font-cairo text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-cairo text-sm text-white/60 mb-2">ملاحظات</label>
                  <textarea
                    value={modal.notes || ''}
                    onChange={e => setModal({ ...modal, notes: e.target.value })}
                    placeholder="ملاحظات عن العميل..."
                    rows={3}
                    className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm resize-none"
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div>
                    <p className="font-cairo text-white text-sm font-bold">تفعيل الحساب</p>
                    <p className="font-cairo text-white/30 text-xs">السماح للعميل بتسجيل الدخول</p>
                  </div>
                  <button
                    onClick={() => setModal({ ...modal, is_active: !modal.is_active })}
                    className={`w-11 h-6 rounded-full transition-all relative ${modal.is_active ? '' : 'bg-white/10'}`}
                    style={modal.is_active ? { background: 'linear-gradient(135deg, #C58B5B, #d4a76a)' } : {}}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md absolute top-1 transition-all ${modal.is_active ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-gold w-full py-3 rounded-xl font-cairo text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isNew ? 'إنشاء الحساب' : 'حفظ التغييرات'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
