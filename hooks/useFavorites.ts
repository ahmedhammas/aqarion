'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aqarion_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: number[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id)
        ? prev.filter((fId) => fId !== id)
        : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      } catch {
        // Ignore
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((id: number) => {
    return favorites.includes(id);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    count: favorites.length,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
