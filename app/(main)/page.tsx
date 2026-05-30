"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2 } from 'lucide-react';

import HeroSection from '@/components/sections/HeroSection';
import FiltersSection from '@/components/sections/FiltersSection';
import FeaturedPropertiesSection from '@/components/sections/FeaturedPropertiesSection';
import AboutSection from '@/components/sections/AboutSection';
import TeamSection from '@/components/sections/TeamSection';
import StatisticsSection from '@/components/sections/StatisticsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import AdSection from '@/components/AdSection';

export interface ActiveFilters {
  city: string;
  type: string;
  price: string;
  listingType: string;
}

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ActiveFilters>({
    city: '',
    type: '',
    price: '',
    listingType: '',
  });

  useEffect(() => {
    fetch('/api/admin/properties?perPage=100')
      .then(r => r.json())
      .then(d => {
        setProperties(d.properties || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch properties:', err);
        setLoading(false);
      });
  }, []);

  const handleFilter = useCallback((newFilters: ActiveFilters) => {
    setFilters(newFilters);
  }, []);

  const filteredProperties = properties.filter((property) => {
    // City filter
    if (filters.city && filters.city !== 'جميع المدن' && property.city !== filters.city) {
      return false;
    }
    // Type filter
    if (filters.type && filters.type !== 'جميع الأنواع' && property.typeLabel !== filters.type) {
      return false;
    }
    // Price filter
    if (filters.price && filters.price !== 'all') {
      const [minStr, maxStr] = filters.price.split('-');
      const min = parseInt(minStr);
      if (maxStr) {
        const max = parseInt(maxStr);
        if (property.priceNum < min || property.priceNum > max) return false;
      } else {
        // "10000000+" case
        const minVal = parseInt(filters.price.replace('+', ''));
        if (property.priceNum < minVal) return false;
      }
    }
    // Listing type filter
    if (filters.listingType) {
      if (filters.listingType === 'للبيع' && property.listingType !== 'sale' && property.listingType !== 'both') return false;
      if (filters.listingType === 'للإيجار' && property.listingType !== 'rent' && property.listingType !== 'both') return false;
      if (filters.listingType === 'تجاري' && property.type !== 'office') return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020a18]">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdSection position="popup" />
      <HeroSection />
      <FiltersSection onFilter={handleFilter} />
      <FeaturedPropertiesSection properties={filteredProperties} />
      <AdSection position="home_banner" />
      <AboutSection />
      <TeamSection />
      <StatisticsSection />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}