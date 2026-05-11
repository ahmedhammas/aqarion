'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MailOpen, MessageSquare, Archive, Search, Phone, User,
  Calendar, Building2, Reply, Loader2, CheckCircle, Clock, X
} from 'lucide-react';

interface Message {
  id: number; first_name: string; last_name: string; email: string;
  phone: string; message: string; property_id?: number; status: string;
  reply_text?: string; replied_at?: string; source: string; created_at: string;
}

interface Stats { total: number; new: number; read: number; replied: number; archived: number; }

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  new: { label: 'جديد', icon: Mail, color: 'text-red-400 bg-red-400/10' },
  read: { label: 'مقروء', icon: MailOpen, color: 'text-blue-400 bg-blue-400/10' },
  replied: { label: 'تم الرد', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-400/10' },
  archived: { label: 'مؤرشف', icon: Archive, color: 'text-white/30 bg-white/5' },
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, read: 0, replied: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchMessages = async () => {
    const res = await fetch('/api/admin/messages');
    const data = await res.json();
    setMessages(data.messages || []);
    setStats(data.stats || { total: 0, new: 0, read: 0, replied: 0, archived: 0 });
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const selected = messages.find(m => m.id === selectedId);

  const filteredMessages = messages.filter(m => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (search && !`${m.first_name} ${m.last_name} ${m.email} ${m.message}`.includes(search)) return false;
    return true;
  });

  const markAsRead = async (id: number) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read' }),
    });
    fetchMessages();
  };

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return;
    setReplying(true);
    await fetch(`/api/admin/messages/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'replied', reply_text: replyText }),
    });
    setReplyText('');
    setReplying(false);
    fetchMessages();
  };

  const handleArchive = async (id: number) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'archived' }),
    });
    if (selectedId === id) setSelectedId(null);
    fetchMessages();
  };

  const selectMessage = (msg: Message) => {
    setSelectedId(msg.id);
    if (msg.status === 'new') markAsRead(msg.id);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-cairo font-bold text-2xl text-white">الرسائل</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'جديد', value: stats.new, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'مقروء', value: stats.read, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'تم الرد', value: stats.replied, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'الإجمالي', value: stats.total, color: 'text-gold', bg: 'bg-gold/10' },
        ].map(s => (
          <div key={s.label} className="glass-card-dark rounded-xl p-4 border border-gold/10 text-center">
            <p className={`font-cairo font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="font-cairo text-white/40 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Split View */}
      <div className="grid lg:grid-cols-5 gap-4 min-h-[60vh]">
        {/* Messages List */}
        <div className="lg:col-span-2 glass-card-dark rounded-2xl border border-gold/10 flex flex-col overflow-hidden">
          {/* Filters */}
          <div className="p-3 border-b border-gold/10 space-y-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="w-full input-luxury rounded-lg py-2 pr-9 pl-3 font-cairo text-xs" />
            </div>
            <div className="flex gap-1">
              {['all', 'new', 'read', 'replied'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg font-cairo text-xs transition-all ${filter === f ? 'bg-gold/15 text-gold' : 'text-white/40 hover:text-white'}`}>
                  {f === 'all' ? 'الكل' : statusConfig[f]?.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map(msg => (
              <button
                key={msg.id}
                onClick={() => selectMessage(msg)}
                className={`w-full text-right p-3 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors ${selectedId === msg.id ? 'bg-gold/5 border-r-2 border-r-gold' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.status === 'new' ? 'bg-red-400/15' : 'bg-white/5'}`}>
                    {msg.status === 'new' ? <Mail className="w-4 h-4 text-red-400" /> : <MailOpen className="w-4 h-4 text-white/30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-cairo text-sm truncate ${msg.status === 'new' ? 'font-bold text-white' : 'text-white/70'}`}>{msg.first_name} {msg.last_name}</p>
                      <span className="font-cairo text-white/30 text-[10px] flex-shrink-0">{timeAgo(msg.created_at)}</span>
                    </div>
                    <p className="font-cairo text-white/40 text-xs truncate">{msg.message}</p>
                  </div>
                </div>
              </button>
            ))}
            {filteredMessages.length === 0 && (
              <p className="font-cairo text-white/30 text-sm text-center py-10">لا توجد رسائل</p>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3 glass-card-dark rounded-2xl border border-gold/10 flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="p-5 border-b border-gold/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-cairo font-bold text-lg text-white">{selected.first_name} {selected.last_name}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-white/50">
                      <span className="flex items-center gap-1 font-cairo text-xs"><Mail className="w-3 h-3 text-gold" />{selected.email}</span>
                      <span className="flex items-center gap-1 font-cairo text-xs"><Phone className="w-3 h-3 text-gold" />{selected.phone}</span>
                      <span className="flex items-center gap-1 font-cairo text-xs"><Clock className="w-3 h-3 text-gold" />{timeAgo(selected.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg font-cairo text-xs ${statusConfig[selected.status]?.color}`}>
                      {statusConfig[selected.status]?.label}
                    </span>
                    <button onClick={() => handleArchive(selected.id)} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors" title="أرشفة">
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto">
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <p className="font-cairo text-white/80 text-sm leading-relaxed">{selected.message}</p>
                </div>

                {selected.reply_text && (
                  <div className="mt-4 bg-gold/5 rounded-xl p-4 border border-gold/15">
                    <p className="font-cairo text-gold text-xs font-bold mb-2 flex items-center gap-1"><Reply className="w-3 h-3" /> ردك:</p>
                    <p className="font-cairo text-white/70 text-sm">{selected.reply_text}</p>
                  </div>
                )}
              </div>

              {/* Reply Box */}
              {selected.status !== 'replied' && (
                <div className="p-4 border-t border-gold/10">
                  <div className="flex gap-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="اكتب ردك هنا..."
                      className="flex-1 input-luxury rounded-xl py-2.5 px-4 font-cairo text-sm min-h-[44px] max-h-[100px] resize-none"
                    />
                    <button onClick={handleReply} disabled={replying || !replyText.trim()} className="btn-gold px-4 rounded-xl font-cairo text-sm font-bold flex items-center gap-1 disabled:opacity-50">
                      {replying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Reply className="w-4 h-4" />}
                      رد
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="font-cairo text-white/30 text-sm">اختر رسالة لعرض تفاصيلها</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
