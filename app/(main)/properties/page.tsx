'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, BedDouble, Bath, Maximize, Heart, Search, Grid3X3, List,
  ChevronLeft, ArrowUpDown, SearchX
} from 'lucide-react';
import { properties, cities, propertyTypes, priceRanges } from '@/data/properties';
import { useFavorites } from '@/hooks/useFavorites';
import { fadeUp } from '@/lib/animations';

type SortOption = 'newest' | 'cheapest' | 'expensive' | 'largest';

export default function PropertiesPage() {
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const { isFavorite, toggleFavorite } = useFavorites();

  const [propertiesData, setPropertiesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/properties?perPage=100')
      .then(r => r.json())
      .then(d => {
        setPropertiesData(d.properties || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...propertiesData];

    if (city && city !== 'جميع المدن') result = result.filter((p) => p.city === city);
    if (type && type !== 'جميع الأنواع') result = result.filter((p) => p.typeLabel === type);
    if (price && price !== 'all') {
      const [minStr, maxStr] = price.split('-');
      const min = parseInt(minStr);
      if (maxStr) {
        const max = parseInt(maxStr);
        result = result.filter((p) => p.priceNum >= min && p.priceNum <= max);
      } else {
        const minVal = parseInt(price.replace('+', ''));
        result = result.filter((p) => p.priceNum >= minVal);
      }
    }

    switch (sortBy) {
      case 'cheapest': result.sort((a, b) => a.priceNum - b.priceNum); break;
      case 'expensive': result.sort((a, b) => b.priceNum - a.priceNum); break;
      case 'largest': result.sort((a, b) => b.area - a.area); break;
      default: result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [city, type, price, sortBy, propertiesData]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedProperties = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-cairo text-sm text-white/50 mb-8">
          <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gold">العقارات</span>
        </nav>

        {/* Page Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-10">
          <h1 className="section-title text-3xl md:text-5xl text-white mb-4">
            جميع <span className="gold-gradient-text">العقارات</span>
          </h1>
          <p className="font-cairo text-white/60 text-lg">تصفح جميع العقارات المتاحة واختر ما يناسبك</p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.1}
          className="glass-card-dark rounded-2xl p-4 mb-8 border border-gold/15"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} className="input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none cursor-pointer">
              <option value="" className="bg-navy-dark">المدينة</option>
              {cities.map((c) => <option key={c} value={c} className="bg-navy-dark">{c}</option>)}
            </select>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none cursor-pointer">
              <option value="" className="bg-navy-dark">نوع العقار</option>
              {propertyTypes.map((t) => <option key={t} value={t} className="bg-navy-dark">{t}</option>)}
            </select>
            <select value={price} onChange={(e) => { setPrice(e.target.value); setPage(1); }} className="input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none cursor-pointer">
              <option value="" className="bg-navy-dark">نطاق السعر</option>
              {priceRanges.map((p) => <option key={p.value} value={p.value} className="bg-navy-dark">{p.label}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="input-luxury rounded-xl py-3 px-4 font-cairo text-sm appearance-none cursor-pointer">
              <option value="newest" className="bg-navy-dark">الأحدث</option>
              <option value="cheapest" className="bg-navy-dark">الأرخص</option>
              <option value="expensive" className="bg-navy-dark">الأغلى</option>
              <option value="largest" className="bg-navy-dark">الأكبر مساحة</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-cairo text-white/50 text-sm">
              عرض {paginatedProperties.length} من أصل {filtered.length} عقار
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gold/20 text-gold' : 'text-white/40 hover:text-white'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gold/20 text-gold' : 'text-white/40 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Properties */}
        <AnimatePresence mode="wait">
          {paginatedProperties.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <SearchX className="w-10 h-10 text-gold/50" />
              </div>
              <h3 className="font-cairo font-bold text-2xl text-white mb-3">لا توجد نتائج</h3>
              <p className="font-cairo text-white/50">جرّب تغيير معايير البحث</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}
            >
              {paginatedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={index * 0.08}
                  className={`glass-card-dark rounded-3xl overflow-hidden group border border-gold/10 hover:border-gold/30 transition-all duration-500 ${
                    viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                  }`}
                >
                  <Link href={`/property/${property.id}`} className={viewMode === 'list' ? 'md:w-80 flex-shrink-0' : ''}>
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'h-48 md:h-full' : 'h-64'}`}>
                      <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className="bg-gold/90 text-white px-3 py-1 rounded-full font-cairo text-xs font-bold">{property.typeLabel}</span>
                        {property.tag && <span className="bg-navy-dark/80 backdrop-blur-md text-white px-3 py-1 rounded-full font-cairo text-xs font-bold border border-white/10">{property.tag}</span>}
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <p className="font-cairo font-bold text-2xl text-white">{property.price} <span className="text-sm text-white/80">ج.م</span></p>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`absolute top-4 left-4 z-20 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all ${
                      isFavorite(property.id) ? 'bg-gold border-gold text-white' : 'bg-navy-dark/50 border-white/10 text-white hover:bg-gold hover:border-gold'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(property.id) ? 'fill-white' : ''}`} />
                  </button>

                  <Link href={`/property/${property.id}`} className="flex-1">
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-white/50 mb-3">
                        <MapPin className="w-4 h-4 text-gold" />
                        <span className="font-cairo text-sm">{property.city} - {property.location}</span>
                      </div>
                      <h3 className="font-cairo font-bold text-xl text-white mb-4 group-hover:text-gold transition-colors">{property.name}</h3>
                      {viewMode === 'list' && property.description && (
                        <p className="font-cairo text-white/50 text-sm mb-4 line-clamp-2">{property.description}</p>
                      )}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                        <div className="flex flex-col items-center gap-1">
                          <BedDouble className="w-4 h-4 text-gold/80" />
                          <span className="font-cairo text-white/70 text-xs">{property.bedrooms} غرف</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Bath className="w-4 h-4 text-gold/80" />
                          <span className="font-cairo text-white/70 text-xs">{property.bathrooms} حمام</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Maximize className="w-4 h-4 text-gold/80" />
                          <span className="font-cairo text-white/70 text-xs">{property.area} م²</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-10 h-10 rounded-xl font-cairo font-bold transition-all ${
                  page === i + 1 ? 'bg-gold text-white shadow-gold' : 'glass-card text-white/60 hover:text-gold hover:border-gold/30'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
