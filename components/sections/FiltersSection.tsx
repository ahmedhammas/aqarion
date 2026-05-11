'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Chrome as Home, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cities, propertyTypes, priceRanges } from '@/data/properties';
import type { ActiveFilters } from '@/app/page';

interface FiltersSectionProps {
  onFilter?: (filters: ActiveFilters) => void;
}

export default function FiltersSection({ onFilter }: FiltersSectionProps) {
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [listingType, setListingType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onFilter?.({ city, type, price, listingType });
    const el = document.getElementById('properties');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTagClick = (tag: string) => {
    const newListing = listingType === tag ? '' : tag;
    setListingType(newListing);
    onFilter?.({ city, type, price, listingType: newListing });
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    onFilter?.({ city: value, type, price, listingType });
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    onFilter?.({ city, type: value, price, listingType });
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
    onFilter?.({ city, type, price: value, listingType });
  };

  const clearFilters = () => {
    setCity('');
    setType('');
    setPrice('');
    setListingType('');
    onFilter?.({ city: '', type: '', price: '', listingType: '' });
  };

  const hasActiveFilters = city || type || price || listingType;

  return (
    <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card-dark rounded-3xl p-2 shadow-navy-lg border border-gold/15"
        >
          <div className="flex flex-col lg:flex-row gap-2">
            {/* City Filter */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-10">
                <MapPin className="w-4 h-4 text-gold/60 group-focus-within:text-gold transition-colors" />
              </div>
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full input-luxury rounded-2xl py-4 pr-10 pl-4 font-cairo text-sm appearance-none cursor-pointer"
              >
                <option value="" className="bg-navy-dark">المدينة</option>
                {cities.map((c) => (
                  <option key={c} value={c} className="bg-navy-dark">{c}</option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-gold/15 my-2" />

            {/* Property Type */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-10">
                <Home className="w-4 h-4 text-gold/60 group-focus-within:text-gold transition-colors" />
              </div>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full input-luxury rounded-2xl py-4 pr-10 pl-4 font-cairo text-sm appearance-none cursor-pointer"
              >
                <option value="" className="bg-navy-dark">نوع العقار</option>
                {propertyTypes.map((t) => (
                  <option key={t} value={t} className="bg-navy-dark">{t}</option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-gold/15 my-2" />

            {/* Price Range */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-10">
                <span className="text-gold/60 font-cairo text-xs font-bold group-focus-within:text-gold transition-colors">ج.م</span>
              </div>
              <select
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full input-luxury rounded-2xl py-4 pr-10 pl-4 font-cairo text-sm appearance-none cursor-pointer"
              >
                <option value="" className="bg-navy-dark">نطاق السعر</option>
                {priceRanges.map((p) => (
                  <option key={p.value} value={p.value} className="bg-navy-dark">{p.label}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="btn-gold flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-cairo font-bold text-base whitespace-nowrap lg:min-w-[140px]"
            >
              <Search className="w-5 h-5" />
              بحث
            </button>
          </div>

          {/* Tags and advanced filters */}
          <div className="flex items-center justify-between px-2 pt-2 pb-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors font-cairo text-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                فلاتر إضافية
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-red-400/70 hover:text-red-400 font-cairo text-xs transition-colors"
                >
                  مسح الكل ✕
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {['للبيع', 'للإيجار', 'تجاري'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full border transition-all font-cairo text-xs cursor-pointer ${listingType === tag
                    ? 'border-gold bg-gold/20 text-gold'
                    : 'border-gold/20 text-white/50 hover:border-gold/50 hover:text-gold'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2 pb-3 pt-1">
                  <div className="relative">
                    <label className="block font-cairo text-xs text-white/40 mb-1 mr-1">عدد الغرف</label>
                    <select className="w-full input-luxury rounded-xl py-2.5 px-3 font-cairo text-xs appearance-none cursor-pointer">
                      <option value="" className="bg-navy-dark">الكل</option>
                      <option value="1" className="bg-navy-dark">1 غرفة</option>
                      <option value="2" className="bg-navy-dark">2 غرف</option>
                      <option value="3" className="bg-navy-dark">3 غرف</option>
                      <option value="4" className="bg-navy-dark">4 غرف</option>
                      <option value="5" className="bg-navy-dark">5+ غرف</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block font-cairo text-xs text-white/40 mb-1 mr-1">المساحة (م²)</label>
                    <select className="w-full input-luxury rounded-xl py-2.5 px-3 font-cairo text-xs appearance-none cursor-pointer">
                      <option value="" className="bg-navy-dark">الكل</option>
                      <option value="0-100" className="bg-navy-dark">أقل من 100</option>
                      <option value="100-200" className="bg-navy-dark">100 - 200</option>
                      <option value="200-300" className="bg-navy-dark">200 - 300</option>
                      <option value="300+" className="bg-navy-dark">أكثر من 300</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block font-cairo text-xs text-white/40 mb-1 mr-1">التشطيب</label>
                    <select className="w-full input-luxury rounded-xl py-2.5 px-3 font-cairo text-xs appearance-none cursor-pointer">
                      <option value="" className="bg-navy-dark">الكل</option>
                      <option value="super-lux" className="bg-navy-dark">سوبر لوكس</option>
                      <option value="lux" className="bg-navy-dark">لوكس</option>
                      <option value="semi" className="bg-navy-dark">نصف تشطيب</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block font-cairo text-xs text-white/40 mb-1 mr-1">الحالة</label>
                    <select className="w-full input-luxury rounded-xl py-2.5 px-3 font-cairo text-xs appearance-none cursor-pointer">
                      <option value="" className="bg-navy-dark">الكل</option>
                      <option value="available" className="bg-navy-dark">متاح</option>
                      <option value="sold" className="bg-navy-dark">تم البيع</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
