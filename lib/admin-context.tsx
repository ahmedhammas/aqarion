'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface AdminContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const stored = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_token='));

    if (stored) {
      try {
        const token = decodeURIComponent(stored.split('=')[1]);
        const session = JSON.parse(token);
        if (session.role === 'admin') {
          setUser(session);
        }
      } catch {
        // Invalid token
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        // Set cookie for middleware
        document.cookie = `admin_token=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        return { success: true };
      } else {
        return { success: false, error: data.error || 'فشل تسجيل الدخول' };
      }
    } catch {
      return { success: false, error: 'حدث خطأ في الاتصال' };
    }
  };

  const logout = () => {
    setUser(null);
    document.cookie = 'admin_token=; path=/; max-age=0';
    window.location.href = '/admin/login';
  };

  return (
    <AdminContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
