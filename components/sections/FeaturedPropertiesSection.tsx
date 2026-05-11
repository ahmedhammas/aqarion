'use client';

import Image from 'next/image';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, BedDouble, Bath, Maximize, Heart, ArrowLeft, SearchX } from 'lucide-react';
import { properties as allProperties, type Property } from '@/data/properties';
import { fadeUp } from '@/lib/animations';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';

interface FeaturedPropertiesSectionProps {
  properties?: Property[];
}

export default function FeaturedPropertiesSection({ properties }: FeaturedPropertiesSectionProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { isFavorite, toggleFavorite, count: favCount } = useFavorites();

  // If properties are passed (filtered), use them; otherwise show featured
  const displayProperties = properties || allProperties.filter((p) => p.featured);
  const showAll = !!properties;

  return (
    <section id="properties" className="py-24 relative overflow-hidden">
      <div className="absolute top-40 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-light/20 rounded-full blur-[100px] pointer-events-none" />

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
              <span className="font-cairo text-gold font-semibold tracking-wider">عقاراتنا المميزة</span>
            </div>
            <h2 className="section-title text-3xl md:text-5xl text-white mb-6">
              أحدث <span className="gold-gradient-text">العقارات</span>
            </h2>
            <p className="font-cairo text-white/60 text-lg leading-relaxed">
              تصفح مجموعتنا الحصرية من العقارات الفاخرة المصممة بعناية لتناسب ذوقك الرفيع وتطلعاتك.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}>
            <Link
              href="/properties"
              className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-cairo font-bold group"
            >
              عرض كل العقارات
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* No Results Message */}
        <AnimatePresence mode="wait">
          {displayProperties.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <SearchX className="w-10 h-10 text-gold/50" />
              </div>
              <h3 className="font-cairo font-bold text-2xl text-white mb-3">لا توجد عقارات تطابق بحثك</h3>
              <p className="font-cairo text-white/50 text-lg">جرّب تغيير معايير البحث أو إزالة بعض الفلاتر</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayProperties
                .slice(0, showAll ? undefined : 6)
                .map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeUp}
                    custom={index * 0.1}
                    className="glass-card-dark rounded-3xl overflow-hidden group cursor-pointer property-card border border-gold/10 hover:border-gold/30 transition-all duration-500"
                    onMouseEnter={() => setHoveredId(property.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Link href={`/property/${property.id}`}>
                      <div className="relative h-64 overflow-hidden shimmer-skeleton">
                        <Image
                          src={property.image}
                          alt={property.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover property-img transition-transform duration-700 relative z-10"
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.parentElement?.classList.remove('shimmer-skeleton');
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-80 z-10" />

                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                          <span className="bg-gold/90 text-white px-3 py-1 rounded-full font-cairo text-xs font-bold shadow-lg">
                            {property.typeLabel}
                          </span>
                          {property.tag && (
                            <span className="bg-navy-dark/80 backdrop-blur-md text-white px-3 py-1 rounded-full font-cairo text-xs font-bold border border-white/10">
                              {property.tag}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-4 right-4 z-20">
                          <p className="font-cairo font-bold text-2xl text-white drop-shadow-md">
                            {property.price} <span className="text-sm text-white/80 font-normal">ج.م</span>
                          </p>
                        </div>
                      </div>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
                      className={`absolute top-4 left-4 z-20 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all duration-300 ${isFavorite(property.id)
                        ? 'bg-gold border-gold text-white scale-110'
                        : 'bg-navy-dark/50 border-white/10 text-white hover:bg-gold hover:border-gold'
                        }`}
                    >
                      <Heart className={`w-5 h-5 transition-all ${isFavorite(property.id) ? 'fill-white' : ''}`} />
                    </button>

                    <Link href={`/property/${property.id}`}>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-white/50 mb-3">
                          <MapPin className="w-4 h-4 text-gold" />
                          <span className="font-cairo text-sm">
                            {property.city} - {property.location}
                          </span>
                        </div>

                        <h3 className="font-cairo font-bold text-xl text-white mb-6 group-hover:text-gold transition-colors">
                          {property.name}
                        </h3>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                          <div className="flex flex-col items-center gap-2">
                            <BedDouble className="w-5 h-5 text-gold/80" />
                            <span className="font-cairo text-white/70 text-sm">{property.bedrooms} غرف</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 border-r border-white/10">
                            <Bath className="w-5 h-5 text-gold/80" />
                            <span className="font-cairo text-white/70 text-sm">{property.bathrooms} حمام</span>
                          </div>
                          <div className="flex flex-col items-center gap-2 border-r border-white/10">
                            <Maximize className="w-5 h-5 text-gold/80" />
                            <span className="font-cairo text-white/70 text-sm">{property.area} م²</span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div
                      className={`h-1 w-full bg-gold transform origin-right transition-transform duration-500 ease-out ${hoveredId === property.id ? 'scale-x-100' : 'scale-x-0'
                        }`}
                    />
                  </motion.div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
