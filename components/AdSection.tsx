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
    // For popup ads, check if already seen in this session
    if (position === 'popup' && typeof window !== 'undefined') {
      const hasSeenPopup = sessionStorage.getItem('hasSeenPopupAd');
      if (hasSeenPopup) {
        setIsVisible(false);
        return;
      }
    }

    const fetchAds = async () => {
      try {
        const params = new URLSearchParams({ position });
        const response = await fetch(`/api/ads?${params}`, {
          headers: { 'Cache-Control': 'max-age=3600' },
        });

        if (!response.ok) throw new Error('Failed to fetch ads');

        const data = await response.json();
        const matchingAds = (data.ads || []).filter((a: Ad) => a.position === position);

        if (matchingAds.length > 0) {
          setAd(matchingAds[Math.floor(Math.random() * matchingAds.length)]);
        }
      } catch (err) {
        console.warn('Error fetching ads:', err);
      }
    };

    fetchAds();
  }, [position]);

  const handleClosePopup = () => {
    setIsVisible(false);
    if (position === 'popup' && typeof window !== 'undefined') {
      sessionStorage.setItem('hasSeenPopupAd', 'true');
    }
  };

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
            onClick={handleClosePopup}
            className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <a href={ad.link} className="block group" target="_blank" rel="noopener noreferrer">
            <div className="relative aspect-video bg-gray-900">
              <img 
                src={ad.image_url} 
                alt={ad.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                loading="lazy"
                onError={(e: any) => e.target.style.backgroundColor = '#1a1a1a'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="font-cairo font-bold text-2xl text-white mb-2 line-clamp-2">{ad.title}</h3>
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
            className="block relative h-[250px] md:h-[350px] rounded-3xl overflow-hidden group border border-gold/10 bg-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src={ad.image_url} 
              alt={ad.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              loading="lazy"
              onError={(e: any) => e.target.style.backgroundColor = '#1a1a1a'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex items-center p-8 md:p-16">
              <div className="max-w-md">
                <span className="inline-block px-3 py-1 bg-gold/20 text-gold rounded-full font-cairo text-xs mb-4 border border-gold/20">إعلان مميز</span>
                <h3 className="font-cairo font-bold text-3xl md:text-4xl text-white mb-6 leading-tight line-clamp-3">{ad.title}</h3>
                <div className="inline-flex items-center gap-3 bg-gold text-navy-dark px-6 py-3 rounded-xl font-cairo font-bold text-sm transition-all hover:bg-gold-light shadow-lg hover:shadow-xl">
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

  if (position === 'sidebar') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-4 rounded-2xl border border-gold/10 overflow-hidden bg-gradient-to-br from-gold/5 to-transparent hover:border-gold/20 transition-all"
      >
        <a href={ad.link} className="block group" target="_blank" rel="noopener noreferrer">
          <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-gray-900">
            <img 
              src={ad.image_url} 
              alt={ad.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              loading="lazy"
              onError={(e: any) => e.target.style.backgroundColor = '#1a1a1a'}
            />
          </div>
          <h4 className="font-cairo font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-gold transition-colors">{ad.title}</h4>
          <div className="text-gold text-xs font-cairo flex items-center gap-1">
            <span>عرض أكثر</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>
      </motion.div>
    );
  }

  if (position === 'footer_banner') {
    return (
      <div className="py-8 px-4 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.a 
            href={ad.link}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="block relative h-[120px] md:h-[180px] rounded-2xl overflow-hidden border border-white/10 group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src={ad.image_url} 
              alt={ad.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              loading="lazy"
              onError={(e: any) => e.target.style.backgroundColor = '#1a1a1a'}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="text-center px-4">
                <h3 className="font-cairo font-bold text-lg md:text-xl text-white mb-2">{ad.title}</h3>
                <span className="font-cairo text-gold text-xs font-bold px-3 py-1 bg-gold/10 rounded-full border border-gold/20">إعلان</span>
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    );
  }

  if (position === 'search_top') {
    return (
      <div className="mb-8">
        <motion.a 
          href={ad.link}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="block relative h-[100px] md:h-[140px] rounded-2xl overflow-hidden border border-gold/10 group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            src={ad.image_url} 
            alt={ad.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            loading="lazy"
            onError={(e: any) => e.target.style.backgroundColor = '#1a1a1a'}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent flex items-center px-6 md:px-10">
            <div>
              <span className="font-cairo text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 mb-2 inline-block">إعلان ممول</span>
              <h3 className="font-cairo font-bold text-white text-base md:text-lg">{ad.title}</h3>
            </div>
          </div>
        </motion.a>
      </div>
    );
  }

  return null;
}
