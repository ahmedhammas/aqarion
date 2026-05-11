'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, ChevronLeft, Share2, MessageCircle, Loader2 } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import { useState, useEffect } from 'react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(data => {
        const found = data.posts?.find((p: any) => p.slug === slug);
        if (found) {
          setPost(found);
          setRelatedPosts((data.posts || []).filter((p: any) => p.slug !== slug).slice(0, 2));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020a18]">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-cairo font-bold text-4xl text-white mb-4">مقال غير موجود</h1>
          <p className="font-cairo text-white/60 mb-8">المقال المطلوب غير متوفر.</p>
          <Link href="/blog" className="btn-gold px-8 py-3 rounded-2xl font-cairo font-bold">
            العودة للمدونة
          </Link>
        </div>
      </div>
    );
  }

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(post.title + '\n' + window.location.href)}`);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-cairo text-sm text-white/50 mb-8">
          <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/blog" className="hover:text-gold transition-colors">المدونة</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gold line-clamp-1">{post.title}</span>
        </nav>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-10 h-[300px] md:h-[450px]"
        >
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/30 to-transparent" />
          <div className="absolute top-6 right-6">
            <span className="bg-gold text-white px-4 py-1.5 rounded-full font-cairo text-xs font-bold shadow-lg">
              {post.category}
            </span>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.article variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
          {/* Meta */}
          <div className="flex items-center gap-6 text-white/50 mb-6 font-cairo text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gold" />
              <span>{post.author}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-cairo font-bold text-3xl md:text-4xl text-white mb-8 leading-relaxed">
            {post.title}
          </h1>

          {/* Content */}
          <div className="font-cairo text-white/75 text-lg leading-[2] whitespace-pre-line mb-12">
            {post.content}
          </div>

          {/* Share Buttons */}
          <div className="glass-card rounded-2xl p-6 mb-16">
            <p className="font-cairo font-bold text-white mb-4">شارك المقال</p>
            <div className="flex gap-3">
              <button
                onClick={shareOnWhatsApp}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors font-cairo text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                واتساب
              </button>
              <button
                onClick={shareOnFacebook}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-cairo text-sm"
              >
                <Share2 className="w-4 h-4" />
                فيسبوك
              </button>
              <button
                onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-colors font-cairo text-sm"
              >
                نسخ الرابط
              </button>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-cairo font-bold text-2xl text-white mb-6">مقالات ذات صلة</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <div className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-gold/10 hover:border-gold/30">
                    <div className="relative h-40 overflow-hidden">
                      <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-cairo font-bold text-lg text-white group-hover:text-gold transition-colors line-clamp-2">{related.title}</h3>
                      <p className="font-cairo text-white/50 text-sm mt-2 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        {related.date}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
