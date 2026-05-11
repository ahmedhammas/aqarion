'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Clock } from 'lucide-react';
import { fadeUp } from '@/lib/animations';

export default function AboutSection() {
  const features = [
    {
      icon: Shield,
      title: 'موثوقية وأمان',
      desc: 'نوفر أعلى معايير الأمان في جميع معاملاتك العقارية.',
    },
    {
      icon: Award,
      title: 'خبرة طويلة',
      desc: 'أكثر من 15 عامًا من التميز في السوق العقاري.',
    },
    {
      icon: Clock,
      title: 'دعم على مدار الساعة',
      desc: 'فريقنا متواجد دائمًا للرد على استفساراتك ومساعدتك.',
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-navy-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-12 h-px bg-gold" />
              <span className="font-cairo text-gold font-semibold tracking-wider">من نحن</span>
            </motion.div>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.1}
              className="section-title text-3xl md:text-5xl text-white mb-6"
            >
              شريكك الموثوق في <br />
              <span className="gold-gradient-text">رحلتك العقارية</span>
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.2}
              className="font-cairo text-white/70 text-lg leading-relaxed mb-8"
            >
              في عقاريون المتحدة، نؤمن أن البحث عن العقار المناسب يجب أن يكون تجربة مريحة وواضحة.
              نجمع بين خبرة السوق والتقنيات الحديثة لنقدم لك خيارات مدروسة تناسب احتياجاتك.
            </motion.p>

            <div className="space-y-6 mb-10">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={0.3 + idx * 0.1}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-cairo font-bold text-white text-lg mb-1">{feature.title}</h4>
                    <p className="font-cairo text-white/50 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.6}>
              <a href="#contact" className="inline-block btn-gold px-8 py-4 rounded-2xl font-cairo font-bold text-lg">
                اكتشف المزيد عنا
              </a>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 rounded-3xl overflow-hidden border-2 border-gold/20 glass-card"
            >
              <img
                src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="عن الشركة"
                className="w-full h-full object-cover aspect-[4/5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/20 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8">
                <div className="glass-card-dark rounded-2xl p-6 border border-gold/30">
                  <p className="font-cairo font-bold text-xl text-white mb-2">رؤيتنا</p>
                  <p className="font-cairo text-white/70 text-sm leading-relaxed">
                    أن نكون الوجهة الأولى لكل من يبحث عن عقار يجمع بين الجودة، الموقع المميز، والقيمة
                    الحقيقية.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 -right-10 z-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-10 -left-10 z-20 w-40 h-40 bg-navy-light/30 rounded-full blur-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
