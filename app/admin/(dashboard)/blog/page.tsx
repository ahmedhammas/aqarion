'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Calendar, User, Search, Loader2, FileText } from 'lucide-react';

interface BlogPost {
  id: number; slug: string; title: string; excerpt?: string; cover_image?: string;
  category: string; status: string; views_count: number; date?: string; author?: string; created_at: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/blog').then(r => r.json()).then(d => { setPosts(d.posts || []); setLoading(false); });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = posts.filter(p => !search || p.title.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-cairo font-bold text-2xl text-white">إدارة المدونة</h1>
          <p className="font-cairo text-white/50 text-sm">{posts.length} مقال</p>
        </div>
        <Link href="/admin/blog/new" className="btn-gold px-5 py-2.5 rounded-xl font-cairo text-sm font-bold flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" /> مقال جديد
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث في المقالات..." className="w-full input-luxury rounded-xl py-2.5 pr-10 pl-4 font-cairo text-sm" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card-dark rounded-2xl border border-gold/10 overflow-hidden group">
              {post.cover_image && (
                <div className="h-40 overflow-hidden relative">
                  <Image src={post.cover_image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020a18] to-transparent z-10" />
                  <span className="absolute top-3 right-3 z-20 bg-gold text-white px-2 py-0.5 rounded-full font-cairo text-[10px] font-bold shadow-lg">{post.category}</span>
                  <span className={`absolute top-3 left-3 z-20 px-2 py-0.5 rounded-full font-cairo text-[10px] font-bold shadow-lg ${post.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-white'}`}>
                    {post.status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-cairo font-bold text-white text-sm mb-2 line-clamp-2">{post.title}</h3>
                <p className="font-cairo text-white/40 text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-white/30 text-xs font-cairo">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views_count}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date || new Date(post.created_at).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex gap-1 mt-3 pt-3 border-t border-white/5">
                  <Link href={`/admin/blog/${post.id}`} className="flex-1 py-1.5 rounded-lg text-center font-cairo text-xs text-white/50 hover:text-blue-400 hover:bg-blue-400/5 transition-colors">
                    <Edit className="w-3 h-3 inline ml-1" /> تعديل
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="flex-1 py-1.5 rounded-lg font-cairo text-xs text-white/50 hover:text-red-400 hover:bg-red-400/5 transition-colors">
                    <Trash2 className="w-3 h-3 inline ml-1" /> حذف
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
