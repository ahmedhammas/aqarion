'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Search, Filter, Eye, Edit, Trash2, Star, StarOff,
  MapPin, BedDouble, Maximize, ChevronLeft, ChevronRight, Loader2, AlertTriangle
} from 'lucide-react';

interface Property {
  id: number; name: string; location: string; city: string;
  price: string; priceNum: number; bedrooms: number; bathrooms: number;
  area: number; type: string; typeLabel: string; image: string;
  featured: boolean; tag?: string; status?: string; listingType?: string;
  views_count?: number; is_published?: boolean; created_at?: string;
}

const statusColors: Record<string, string> = {
  available: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/20',
  sold: 'bg-red-400/15 text-red-400 border-red-400/20',
  rented: 'bg-blue-400/15 text-blue-400 border-blue-400/20',
  reserved: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/20',
};

const statusLabels: Record<string, string> = {
  available: 'متاح', sold: 'مباع', rented: 'مؤجر', reserved: 'محجوز',
};

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString(), perPage: '8' });
    if (search) params.set('search', search);
    if (cityFilter) params.set('city', cityFilter);
    if (typeFilter) params.set('type', typeFilter);
    if (statusFilter) params.set('status', statusFilter);

    try {
      const res = await fetch(`/api/admin/properties?${params}`);
      const data = await res.json();
      setProperties(data.properties || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setProperties([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, cityFilter, typeFilter, statusFilter]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProperties();
  };

  const toggleFeatured = async (id: number, featured: boolean) => {
    await fetch(`/api/admin/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !featured }),
    });
    fetchProperties();
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
    setDeleting(false);
    setDeleteModal(null);
    fetchProperties();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-cairo font-bold text-2xl text-white">إدارة العقارات</h1>
          <p className="font-cairo text-white/50 text-sm">{total} عقار مسجل</p>
        </div>
        <Link href="/admin/properties/new" className="btn-gold px-5 py-2.5 rounded-xl font-cairo text-sm font-bold flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" /> إضافة عقار جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card-dark rounded-2xl p-4 border border-gold/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <form onSubmit={handleSearch} className="relative sm:col-span-2">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الموقع..."
              className="w-full input-luxury rounded-xl py-2.5 pr-10 pl-4 font-cairo text-sm"
            />
          </form>
          <select value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setPage(1); }} className="input-luxury rounded-xl py-2.5 px-3 font-cairo text-sm appearance-none cursor-pointer">
            <option value="">جميع المدن</option>
            <option value="القاهرة">القاهرة</option>
            <option value="الشيخ زايد">الشيخ زايد</option>
            <option value="الساحل الشمالي">الساحل الشمالي</option>
            <option value="6 أكتوبر">6 أكتوبر</option>
          </select>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="input-luxury rounded-xl py-2.5 px-3 font-cairo text-sm appearance-none cursor-pointer">
            <option value="">جميع الأنواع</option>
            <option value="فيلا">فيلا</option>
            <option value="شقة">شقة</option>
            <option value="كمبوند">كمبوند</option>
            <option value="مكتب">مكتب</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-luxury rounded-xl py-2.5 px-3 font-cairo text-sm appearance-none cursor-pointer">
            <option value="">جميع الحالات</option>
            <option value="available">متاح</option>
            <option value="sold">مباع</option>
            <option value="rented">مؤجر</option>
            <option value="reserved">محجوز</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 glass-card-dark rounded-2xl border border-gold/10">
          <p className="font-cairo text-white/50 text-lg">لا توجد عقارات</p>
        </div>
      ) : (
        <div className="glass-card-dark rounded-2xl border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10">
                  <th className="text-right font-cairo text-white/50 text-xs font-medium py-3 px-4">العقار</th>
                  <th className="text-right font-cairo text-white/50 text-xs font-medium py-3 px-4 hidden md:table-cell">النوع</th>
                  <th className="text-right font-cairo text-white/50 text-xs font-medium py-3 px-4">السعر</th>
                  <th className="text-right font-cairo text-white/50 text-xs font-medium py-3 px-4 hidden lg:table-cell">الحالة</th>
                  <th className="text-right font-cairo text-white/50 text-xs font-medium py-3 px-4 hidden lg:table-cell">المشاهدات</th>
                  <th className="text-right font-cairo text-white/50 text-xs font-medium py-3 px-4">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => (
                  <tr key={prop.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image src={prop.image} alt={prop.name} fill sizes="48px" className="rounded-xl object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-cairo text-white text-sm font-bold truncate max-w-[200px]">{prop.name}</p>
                          <p className="font-cairo text-white/40 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold/60" /> {prop.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="font-cairo text-white/60 text-xs bg-white/5 px-2 py-1 rounded-lg">{prop.typeLabel}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-cairo text-gold font-bold text-sm">{prop.price} <span className="text-white/30 text-xs">ج.م</span></p>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className={`font-cairo text-xs px-2.5 py-1 rounded-full border ${statusColors[prop.status || 'available']}`}>
                        {statusLabels[prop.status || 'available']}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-white/40">
                        <Eye className="w-3 h-3" />
                        <span className="font-cairo text-xs">{prop.views_count || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFeatured(prop.id, prop.featured)}
                          className={`p-1.5 rounded-lg transition-colors ${prop.featured ? 'text-gold bg-gold/10' : 'text-white/30 hover:text-gold hover:bg-gold/5'}`}
                          title={prop.featured ? 'إلغاء التمييز' : 'تمييز'}
                        >
                          {prop.featured ? <Star className="w-4 h-4 fill-gold" /> : <StarOff className="w-4 h-4" />}
                        </button>
                        <Link href={`/admin/properties/${prop.id}`} className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/5 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteModal(prop.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gold/10">
              <p className="font-cairo text-white/40 text-xs">صفحة {page} من {totalPages}</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg text-white/40 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg font-cairo text-xs font-bold transition-all ${page === i + 1 ? 'bg-gold text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg text-white/40 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-card-dark rounded-2xl p-6 border border-red-400/20 max-w-sm w-full">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-400/10 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-cairo font-bold text-xl text-white text-center mb-2">حذف العقار</h3>
              <p className="font-cairo text-white/50 text-sm text-center mb-6">هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl btn-outline-gold font-cairo text-sm font-bold">إلغاء</button>
                <button onClick={() => handleDelete(deleteModal)} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-cairo text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
