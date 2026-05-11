const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');
const mainDir = path.join(appDir, '(main)');

if (!fs.existsSync(mainDir)) {
  fs.mkdirSync(mainDir, { recursive: true });
}

const itemsToMove = ['page.tsx', 'blog', 'properties', 'property', 'layout.tsx'];

for (const item of itemsToMove) {
  const source = path.join(appDir, item);
  const dest = path.join(mainDir, item);

  if (fs.existsSync(source) && source !== dest) {
    try {
      if (fs.lstatSync(source).isDirectory()) {
        fs.cpSync(source, dest, { recursive: true });
        fs.rmSync(source, { recursive: true, force: true });
      } else {
        fs.copyFileSync(source, dest);
        fs.unlinkSync(source);
      }
      console.log(`Moved ${item}`);
    } catch (e) {
      console.error(`Failed to move ${item}:`, e.message);
    }
  }
}

// Create new minimal layout
const newLayout = `
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'عقاريون المتحدة | منصة العقارات الفاخرة في مصر',
  description: 'منصة عقاريون المتحدة - أفضل منصة عقارية في مصر والشرق الأوسط.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cairo bg-[#020a18] text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
`;
fs.writeFileSync(path.join(appDir, 'layout.tsx'), newLayout.trim());

// Update Admin layout
const adminLayoutPath = path.join(appDir, 'admin', 'layout.tsx');
let adminLayout = fs.readFileSync(adminLayoutPath, 'utf8');
adminLayout = adminLayout.replace(/<html[^>]*>[\s\S]*?<head>[\s\S]*?<\/head>\s*<body[^>]*>/i, '<div className="min-h-screen w-full">');
adminLayout = adminLayout.replace(/<\/body>\s*<\/html>/i, '</div>');
fs.writeFileSync(adminLayoutPath, adminLayout);

console.log('Done!');
