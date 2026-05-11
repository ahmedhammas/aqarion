'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '@/data/properties';

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easeProgress * (to - from) + from));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration, isInView]);

  return <span ref={ref}>{count}</span>;
}

export default function StatisticsSection() {
  return (
    <section id="stats" className="py-20 relative z-20 -mt-10 mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-dark rounded-[2.5rem] p-8 md:p-12 shadow-navy-lg border border-gold/20 relative overflow-hidden">

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/80 via-navy/50 to-navy-dark/80" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="font-cairo font-black text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-gold-light via-gold to-gold-dark mb-2 drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Counter from={0} to={stat.value} duration={2.5} />
                  {stat.suffix && <span className="text-3xl md:text-4xl">{stat.suffix}</span>}
                </div>
                <p className="font-cairo font-medium text-white/70 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
