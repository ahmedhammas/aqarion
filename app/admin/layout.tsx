import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة التحكم | عقاريون المتحدة',
  description: 'لوحة تحكم إدارة منصة عقاريون المتحدة',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}
