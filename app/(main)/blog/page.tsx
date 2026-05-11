'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, ChevronLeft, Search } from 'lucide-react';
import { fadeUp } from '@/lib/animations';

const categories = ['الكل', 'استثمار', 'نصائح', 'ديكور'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogData, setBlogData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(d => {
        setBlogData(d.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...blogData];
    if (activeCategory !== 'الكل') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      result = result.filter(
        (p) =>
          p.title.includes(searchQuery) ||
          p.excerpt.includes(searchQuery) ||
          p.author.includes(searchQuery)
      );
    }
    return result;
  }, [activeCategory, searchQuery, blogData]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-cairo text-sm text-white/50 mb-8">
          <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gold">المدونة</span>
        </nav>

        {/* Page Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="section-title text-3xl md:text-5xl text-white mb-4">
            أحدث <span className="gold-gradient-text">المقالات</span> والأخبار
          </h1>
          <p className="font-cairo text-white/60 text-lg">نصائح عقارية، أخبار السوق، واتجاهات الديكور</p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.1} className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-cairo text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-gold text-white shadow-gold'
                    : 'glass-card text-white/60 hover:text-gold hover:border-gold/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في المقالات..."
              className="w-full input-luxury rounded-xl py-2.5 pr-10 pl-4 font-cairo text-sm"
            />
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post, index) => (
            <motion.article
              key={post.id}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={index * 0.1}
              className="glass-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 border border-gold/10 hover:border-gold/30"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 right-4">
                    <span className="bg-gold text-white px-4 py-1.5 rounded-full font-cairo text-xs font-bold shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-white/50 mb-4 font-cairo text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gold" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gold" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  <h3 className="font-cairo font-bold text-xl text-white mb-3 group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="font-cairo text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>

                  <div className="pt-4 border-t border-white/10">
                    <span className="font-cairo text-gold font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      اقرأ المزيد
                      <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <h3 className="font-cairo font-bold text-2xl text-white mb-3">لا توجد مقالات</h3>
            <p className="font-cairo text-white/50">جرّب تغيير التصنيف أو كلمة البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
