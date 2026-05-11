'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, BedDouble, Bath, Maximize, Heart, ArrowRight, Share2, Phone,
  ChevronLeft, ChevronRight, X, Calendar, Building2, Layers, CheckCircle2
} from 'lucide-react';
import { properties } from '@/data/properties';
import { useFavorites } from '@/hooks/useFavorites';
import { fadeUp } from '@/lib/animations';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const property = properties.find((p) => p.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();

  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-cairo font-bold text-4xl text-white mb-4">عقار غير موجود</h1>
          <p className="font-cairo text-white/60 mb-8">العقار المطلوب غير متوفر أو تم حذفه.</p>
          <Link href="/" className="btn-gold px-8 py-3 rounded-2xl font-cairo font-bold">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images || [property.image];
  const similarProperties = properties
    .filter((p) => p.id !== property.id && p.city === property.city)
    .slice(0, 3);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const shareProperty = (platform: string) => {
    const url = window.location.href;
    const text = `${property.name} - ${property.price} ج.م | عقاريون المتحدة`;
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 font-cairo text-sm text-white/50"
        >
          <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/properties" className="hover:text-gold transition-colors">العقارات</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gold">{property.name}</span>
        </motion.nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-10 group"
        >
          <div className="relative h-[350px] md:h-[500px] cursor-pointer" onClick={() => setLightboxOpen(true)}>
            <img
              src={images[currentImage]}
              alt={property.name}
              className="w-full h-full object-cover transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-navy-dark/20" />
          </div>

          {/* Gallery Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-dark/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:border-gold transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-dark/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:border-gold transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImage ? 'bg-gold w-6' : 'bg-white/40 hover:bg-white/60'
                      }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Tags */}
          <div className="absolute top-4 right-4 flex gap-2">
            {property.tag && (
              <span className="bg-gold/90 text-white px-4 py-1.5 rounded-full font-cairo text-xs font-bold shadow-lg">
                {property.tag}
              </span>
            )}
            <span className="bg-navy-dark/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-cairo text-xs font-bold border border-white/10">
              {property.typeLabel}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all ${isFavorite(property.id)
                ? 'bg-gold border-gold text-white'
                : 'bg-navy-dark/50 border-white/10 text-white hover:bg-gold hover:border-gold'
                }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite(property.id) ? 'fill-white' : ''}`} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-10 h-10 rounded-full bg-navy-dark/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:border-gold transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute top-12 left-0 glass-card-dark rounded-xl p-2 border border-gold/20 min-w-[160px] z-30"
                  >
                    <button onClick={() => shareProperty('whatsapp')} className="w-full text-right px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-gold/10 font-cairo text-xs transition-colors">واتساب</button>
                    <button onClick={() => shareProperty('facebook')} className="w-full text-right px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-gold/10 font-cairo text-xs transition-colors">فيسبوك</button>
                    <button onClick={() => shareProperty('copy')} className="w-full text-right px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-gold/10 font-cairo text-xs transition-colors">نسخ الرابط</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-cairo font-bold text-3xl md:text-4xl text-white mb-3">{property.name}</h1>
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="w-5 h-5 text-gold" />
                    <span className="font-cairo text-lg">{property.city} - {property.location}</span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-cairo font-bold text-3xl text-gold">{property.price}</p>
                  <p className="font-cairo text-white/50 text-sm">جنيه مصري</p>
                </div>
              </div>
            </motion.div>

            {/* Key Stats */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
              <div className="glass-card rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <BedDouble className="w-7 h-7 text-gold mx-auto mb-2" />
                  <p className="font-cairo font-bold text-xl text-white">{property.bedrooms}</p>
                  <p className="font-cairo text-white/50 text-sm">غرف نوم</p>
                </div>
                <div className="text-center">
                  <Bath className="w-7 h-7 text-gold mx-auto mb-2" />
                  <p className="font-cairo font-bold text-xl text-white">{property.bathrooms}</p>
                  <p className="font-cairo text-white/50 text-sm">حمامات</p>
                </div>
                <div className="text-center">
                  <Maximize className="w-7 h-7 text-gold mx-auto mb-2" />
                  <p className="font-cairo font-bold text-xl text-white">{property.area}</p>
                  <p className="font-cairo text-white/50 text-sm">م²</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-7 h-7 text-gold mx-auto mb-2" />
                  <p className="font-cairo font-bold text-xl text-white">{property.yearBuilt || '—'}</p>
                  <p className="font-cairo text-white/50 text-sm">سنة البناء</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.3}>
              <h2 className="font-cairo font-bold text-2xl text-white mb-4">وصف العقار</h2>
              <p className="font-cairo text-white/70 text-lg leading-relaxed whitespace-pre-line">
                {property.description || 'لا يوجد وصف متاح حالياً.'}
              </p>
            </motion.div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.4}>
                <h2 className="font-cairo font-bold text-2xl text-white mb-4">المميزات والخدمات</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 border border-gold/10"
                    >
                      <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="font-cairo text-white/80 text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="glass-card-dark rounded-3xl p-6 border border-gold/20 sticky top-28"
            >
              <h3 className="font-cairo font-bold text-xl text-white mb-6">تواصل بخصوص هذا العقار</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-cairo text-white/50 text-xs">نوع العقار</p>
                    <p className="font-cairo font-bold text-white">{property.typeLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-cairo text-white/50 text-xs">الحالة</p>
                    <p className="font-cairo font-bold text-white">
                      {property.status === 'available' ? '✅ متاح' : property.status === 'sold' ? '❌ تم البيع' : '📋 مؤجر'}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/201001234567?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن: ${property.name} - ${property.price} ج.م`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-cairo font-bold text-lg mb-3"
              >
                <Phone className="w-5 h-5" />
                تواصل الآن
              </a>

              <Link
                href="/#contact"
                className="btn-outline-gold w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-cairo font-bold text-lg"
              >
                أرسل رسالة
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mt-20"
          >
            <h2 className="font-cairo font-bold text-3xl text-white mb-8">
              عقارات مشابهة في <span className="gold-gradient-text">{property.city}</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {similarProperties.map((p) => (
                <Link key={p.id} href={`/property/${p.id}`}>
                  <div className="glass-card-dark rounded-3xl overflow-hidden group cursor-pointer border border-gold/10 hover:border-gold/30 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 right-3">
                        <p className="font-cairo font-bold text-lg text-white">{p.price} <span className="text-xs text-white/80">ج.م</span></p>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-cairo font-bold text-lg text-white mb-2 group-hover:text-gold transition-colors">{p.name}</h3>
                      <div className="flex items-center gap-2 text-white/50">
                        <MapPin className="w-3.5 h-3.5 text-gold" />
                        <span className="font-cairo text-xs">{p.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-navy-dark/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={images[currentImage]}
              alt={property.name}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
