'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { fadeUp } from '@/lib/animations';

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/blog?perPage=3')
      .then(r => r.json())
      .then(d => {
        setBlogPosts((d.posts || []).slice(0, 3));
      })
      .catch(() => {});
  }, []);
  return (
    <section id="blog" className="py-24 relative overflow-hidden bg-[#020a18]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-navy-light/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={0}
            className="max-w-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="font-cairo text-gold font-semibold tracking-wider">المدونة</span>
            </div>
            <h2 className="section-title text-3xl md:text-5xl text-white mb-6">
              أحدث <span className="gold-gradient-text">المقالات</span> والأخبار
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}>
            <Link
              href="/blog"
              className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-cairo font-bold group"
            >
              عرض كل المقالات
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={index * 0.15}
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

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
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
      </div>
    </section>
  );
}
