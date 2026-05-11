"use client";

import { useState, useCallback } from "react";
import { properties } from "@/data/properties";

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
  const [filters, setFilters] = useState<ActiveFilters>({
    city: '',
    type: '',
    price: '',
    listingType: '',
  });

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