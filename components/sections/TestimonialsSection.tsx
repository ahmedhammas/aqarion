'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeUp } from '@/lib/animations';

interface Testimonial {
  id: number;
  client_name: string;
  client_role: string;
  client_avatar: string;
  content: string;
  rating: number;
  is_published: boolean;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then(r => r.json())
      .then(d => {
        const active = (d.testimonials || []).filter((t: Testimonial) => t.is_published);
        setTestimonials(active);
      })
      .catch(() => {});
  }, []);

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
  const totalSlides = Math.max(1, Math.ceil(testimonials.length / itemsPerView));

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    if (isHovered || testimonials.length === 0) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, testimonials.length]);

  const displayItems = testimonials.slice(currentIndex * itemsPerView, currentIndex * itemsPerView + itemsPerView);
  const shown = displayItems.length > 0 ? displayItems : testimonials.slice(0, itemsPerView);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-navy-light/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="font-cairo text-gold font-semibold tracking-wider">آراء العملاء</span>
            <div className="w-12 h-px bg-gold" />
          </motion.div>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
            className="section-title text-3xl md:text-5xl text-white mb-6">
            ماذا يقول <span className="gold-gradient-text">عملاؤنا</span> عنا
          </motion.h2>
        </div>

        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <button onClick={prevSlide} className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-card-dark border border-gold/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/50 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={nextSlide} className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-card-dark border border-gold/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/50 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}
              className="grid md:grid-cols-3 gap-8">
              {shown.map((t) => (
                <div key={t.id} className="glass-card rounded-3xl p-8 relative group hover:-translate-y-2 transition-transform duration-300">
                  <Quote className="absolute top-6 left-6 w-12 h-12 text-gold/10 group-hover:text-gold/20 transition-colors" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating || 5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-gold text-gold" />)}
                  </div>
                  <p className="font-cairo text-white/80 leading-relaxed mb-8 relative z-10 min-h-[100px]">&quot;{t.content}&quot;</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    {t.client_avatar ? (
                      <img src={t.client_avatar} alt={t.client_name} className="w-14 h-14 rounded-full object-cover border-2 border-gold/30" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold font-cairo font-bold text-xl">
                        {t.client_name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-cairo font-bold text-white text-lg">{t.client_name}</h4>
                      <p className="font-cairo text-white/50 text-sm">{t.client_role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-gold' : 'w-2 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
