'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Phone, Mail, Loader2, X, Save, User, GripVertical } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  id: number; name: string; role: string; bio?: string; avatar?: string;
  email?: string; phone?: string; is_active: boolean; display_order: number;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchData = () => {
    fetch('/api/admin/team').then(r => r.json()).then(d => { setTeam(d.team || []); setLoading(false); });
  };
  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setIsNew(true);
    setEditModal({ id: 0, name: '', role: '', bio: '', avatar: '', email: '', phone: '', is_active: true, display_order: team.length });
  };

  const handleSave = async () => {
    if (!editModal) return;
    await fetch('/api/admin/team', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editModal),
    });
    setEditModal(null);
    setIsNew(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('حذف هذا العضو؟')) return;
    await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-cairo font-bold text-2xl text-white">فريق العمل</h1>
        <button onClick={openNew} className="btn-gold px-4 py-2 rounded-xl font-cairo text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة عضو
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member, i) => (
          <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card-dark rounded-2xl p-6 border border-gold/10 text-center group">
            {member.avatar ? (
              <div className="relative w-20 h-20 mx-auto mb-4 flex-shrink-0">
                <Image src={member.avatar} alt={member.name} fill sizes="80px" className="rounded-full object-cover border-2 border-gold/20" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gold/10 flex items-center justify-center border-2 border-gold/20">
                <User className="w-8 h-8 text-gold/50" />
              </div>
            )}
            <h3 className="font-cairo font-bold text-white text-lg">{member.name}</h3>
            <p className="font-cairo text-gold text-sm mb-2">{member.role}</p>
            {member.bio && <p className="font-cairo text-white/40 text-xs mb-4 line-clamp-2">{member.bio}</p>}
            <div className="flex justify-center gap-3 text-white/30 text-xs mb-4">
              {member.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{member.email}</span>}
              {member.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{member.phone}</span>}
            </div>
            <div className="flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setIsNew(false); setEditModal(member); }} className="p-2 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/5">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(member.id)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card-dark rounded-2xl p-6 border border-gold/20 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-cairo font-bold text-lg text-white">{isNew ? 'عضو جديد' : 'تعديل العضو'}</h3>
                <button onClick={() => setEditModal(null)}><X className="w-5 h-5 text-white/30" /></button>
              </div>
              <input value={editModal.name} onChange={e => setEditModal({ ...editModal, name: e.target.value })} placeholder="الاسم" className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm" />
              <input value={editModal.role} onChange={e => setEditModal({ ...editModal, role: e.target.value })} placeholder="المسمى الوظيفي" className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm" />
              <textarea value={editModal.bio || ''} onChange={e => setEditModal({ ...editModal, bio: e.target.value })} placeholder="نبذة قصيرة" className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm min-h-[60px] resize-none" />
              <input value={editModal.avatar || ''} onChange={e => setEditModal({ ...editModal, avatar: e.target.value })} placeholder="رابط الصورة" className="w-full input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm text-left" dir="ltr" />
              <div className="grid grid-cols-2 gap-3">
                <input value={editModal.email || ''} onChange={e => setEditModal({ ...editModal, email: e.target.value })} placeholder="البريد" className="input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm text-left" dir="ltr" />
                <input value={editModal.phone || ''} onChange={e => setEditModal({ ...editModal, phone: e.target.value })} placeholder="الهاتف" className="input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm text-left" dir="ltr" />
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
