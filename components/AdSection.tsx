'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

interface Ad {
  id: number;
  title: string;
  image_url: string;
  link: string;
  position: string;
}

export default function AdSection({ position }: { position: string }) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetch('/api/ads')
      .then(r => r.json())
      .then(d => {
        const matchingAds = d.ads.filter((a: Ad) => a.position === position);
        if (matchingAds.length > 0) {
          // Pick a random ad from matching ones
          setAd(matchingAds[Math.floor(Math.random() * matchingAds.length)]);
        }
      })
      .catch(err => console.error('Error fetching ads:', err));
  }, [position]);

  if (!ad || !isVisible) return null;

  if (position === 'popup') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} 
          animate={{ scale: 1, y: 0 }}
          className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-gold/20 shadow-2xl shadow-gold/10"
        >
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <a href={ad.link} className="block group">
            <div className="relative aspect-video">
              <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <h3 className="font-cairo font-bold text-2xl text-white mb-2">{ad.title}</h3>
                <div className="flex items-center gap-2 text-gold font-cairo text-sm">
                  <span>اكتشف المزيد</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </motion.div>
    );
  }

  if (position === 'home_banner') {
    return (
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.a 
            href={ad.link}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="block relative h-[250px] md:h-[350px] rounded-3xl overflow-hidden group border border-gold/10"
          >
            <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex items-center p-8 md:p-16">
              <div className="max-w-md">
                <span className="inline-block px-3 py-1 bg-gold/20 text-gold rounded-full font-cairo text-xs mb-4 border border-gold/20">إعلان مميز</span>
                <h3 className="font-cairo font-bold text-3xl md:text-4xl text-white mb-6 leading-tight">{ad.title}</h3>
                <div className="inline-flex items-center gap-3 bg-gold text-navy-dark px-6 py-3 rounded-xl font-cairo font-bold text-sm transition-all group-hover:bg-white group-hover:shadow-gold">
                  <span>التفاصيل الآن</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.a>
        </div>
      </section>
    );
  }

  return null;
}
