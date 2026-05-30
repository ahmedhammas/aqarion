const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');
const mainDir = path.join(appDir, '(main)');
const misnamedPageFile = path.join(appDir, '(main)');

// 1. Rename the misnamed file back to page.tsx
if (fs.existsSync(misnamedPageFile) && !fs.lstatSync(misnamedPageFile).isDirectory()) {
  fs.renameSync(misnamedPageFile, path.join(appDir, 'page.tsx'));
}

// 2. Create the real directory (main)
if (!fs.existsSync(mainDir)) {
  fs.mkdirSync(mainDir);
}

// 3. Move the folders
const itemsToMove = ['page.tsx', 'blog', 'properties', 'property'];

for (const item of itemsToMove) {
  const source = path.join(appDir, item);
  const dest = path.join(mainDir, item);

  if (fs.existsSync(source)) {
    fs.renameSync(source, dest);
  }
}

// 4. Create the original app layout inside (main)/layout.tsx
const originalMainLayout = `
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
`;
fs.writeFileSync(path.join(mainDir, 'layout.tsx'), originalMainLayout.trim());

console.log('Fixed directory structure!');
