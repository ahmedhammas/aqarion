'use client';

import { AdminProvider } from '@/lib/admin-context';
import AdminSidebar from '@/components/admin/AdminSidebar';
import '../../globals.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#020a18]">
        <AdminSidebar />
        <main className="lg:mr-[260px] min-h-screen pt-14 lg:pt-0 transition-all duration-300">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminProvider>
  );
}
