import '../globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIChatbot from '@/components/ui/AIChatbot';
import ScrollToTop from '@/components/ui/ScrollToTop';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import AnnouncementBar from '@/components/ui/AnnouncementBar';

export const metadata: Metadata = {
  title: 'عقاريون المتحدة | منصة العقارات الفاخرة في مصر',
  description: 'منصة عقاريون المتحدة - أفضل منصة عقارية في مصر والشرق الأوسط.',
  keywords: ['عقارات', 'فلل', 'شقق', 'كمبوندات', 'عقاريون المتحدة'],
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-cairo bg-navy-dark text-white antialiased min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <AIChatbot />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}