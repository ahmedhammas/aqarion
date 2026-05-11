import type { Metadata } from 'next';
import { Cairo, Tajawal } from 'next/font/google';
import './globals.css';

const cairo = Cairo({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo'
});

const tajawal = Tajawal({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal'
});

export const metadata: Metadata = {
  title: 'عقاريون المتحدة | منصة العقارات الفاخرة في مصر',
  description: 'منصة عقاريون المتحدة - أفضل منصة عقارية في مصر والشرق الأوسط للبحث عن الفلل، الشقق الفاخرة، والمقرات الإدارية.',
  openGraph: {
    title: 'عقاريون المتحدة | منصة العقارات الفاخرة في مصر',
    description: 'ابحث عن عقار أحلامك مع عقاريون المتحدة. أفضل العقارات بأفضل الأسعار.',
    url: 'https://real-estate-tawny-chi-77.vercel.app',
    siteName: 'عقاريون المتحدة',
    images: [
      {
        url: 'https://real-estate-tawny-chi-77.vercel.app/logo.png', // Fallback OG image
        width: 1200,
        height: 630,
        alt: 'عقاريون المتحدة',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'عقاريون المتحدة | منصة العقارات الفاخرة',
    description: 'منصة عقاريون المتحدة - أفضل منصة عقارية في مصر والشرق الأوسط.',
    images: ['https://real-estate-tawny-chi-77.vercel.app/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body className={`font-cairo bg-[#020a18] text-white antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}