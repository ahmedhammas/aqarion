'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Play, Building2, Users, TrendingUp } from 'lucide-react';
import { fadeUp, fadeLeft } from '@/lib/animations';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="grid grid-cols-2 h-full">
          <div className="relative overflow-hidden group">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: 'easeOut' }}
              src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="فيلا فاخرة"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#040f22]/95 via-[#040f22]/70 to-transparent" />
          </div>
          <div className="relative overflow-hidden group">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: 'easeOut' }}
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="فريق عمل محترف"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#040f22]/95 via-[#040f22]/70 to-[#040f22]/30" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#040f22]/60 via-transparent to-[#040f22]" />
      </div>

      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-navy-light/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <div className="order-2 lg:order-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
              <span className="font-cairo text-gold-light text-sm font-medium">منصة العقارات الأولى</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="section-title text-4xl leading-[1.4] sm:text-5xl sm:leading-[1.4] lg:text-5xl lg:leading-[1.4] text-white mb-10 font-black drop-shadow-2xl"
            >
              بيع أو أجّر{' '}
              <span className="gold-gradient-text drop-shadow-[0_0_15px_rgba(197,139,91,0.5)]">منزلك</span>
              <br />
              بأفضل سعر مع
              <br />
              <span className="text-gold-light drop-shadow-md">عقاريون المتحدة</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.35}
              className="font-cairo text-white/60 text-lg leading-relaxed mb-10 max-w-lg"
            >
              نوفر لك أفضل العقارات الفاخرة بأسعار تنافسية ومدروسة، مع فريق متخصص يساعدك في اتخاذ
              قرارات عقارية بثقة.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
              className="flex flex-wrap gap-6 mb-16"
            >
              <a
                href="#properties"
                className="btn-gold flex items-center gap-3 px-10 py-4 rounded-2xl font-cairo font-bold text-xl group"
              >
                اعثر معنا
                <ArrowLeft className="w-6 h-6 transform group-hover:-translate-x-2 transition-transform" />
              </a>
              <a
                href="#about"
                className="btn-outline-gold flex items-center gap-3 px-10 py-4 rounded-2xl font-cairo font-bold text-xl group backdrop-blur-md bg-navy-dark/30"
              >
                <Play className="w-6 h-6 fill-current transform rtl:-scale-x-100 group-hover:scale-110 transition-transform" />
                كيف نعمل
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.55}
              className="flex gap-8"
            >
              {[
                { icon: Building2, value: '٨٠٠+', label: 'عقار' },
                { icon: Users, value: '١٥٠٠+', label: 'عميل' },
                { icon: TrendingUp, value: '١٥', label: 'سنة خبرة' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 mx-auto mb-2">
                    <stat.icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-cairo font-bold text-xl text-white">{stat.value}</p>
                  <p className="font-cairo text-xs text-white/50">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="order-1 lg:order-2 hidden lg:block"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="glass-card-dark rounded-3xl p-8 max-w-sm ml-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-cairo font-bold text-white text-xl">عن الشركة</h3>
                    <p className="font-cairo text-white/50 text-sm mt-1">عقاريون المتحدة</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { value: '٣', label: 'فروع' },
                    { value: '٤', label: 'أقاليم' },
                    { value: '٢', label: 'مناطق' },
                  ].map((item) => (
                    <div key={item.label} className="glass-card rounded-2xl p-3 text-center">
                      <p className="font-cairo font-bold text-2xl text-gold">{item.value}</p>
                      <p className="font-cairo text-xs text-white/50 mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-cairo text-white/50 text-xs mb-3">فريق العمل</p>
                  <div className="flex gap-3">
                    {[
                      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
                      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
                      'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100',
                    ].map((src, i) => (
                      <div key={i} className="relative">
                        <img
                          src={src}
                          alt={`عضو الفريق ${i + 1}`}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-gold/30"
                        />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-green-400 border-2 border-navy-dark" />
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact"
                  className="mt-6 btn-gold w-full py-3 rounded-2xl font-cairo font-semibold text-center block"
                >
                  تواصل معنا
                </a>
              </motion.div>

              <div className="absolute -bottom-8 -right-8 w-32 h-32 opacity-20">
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-cairo text-white/30 text-xs">اسحب للأسفل</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
