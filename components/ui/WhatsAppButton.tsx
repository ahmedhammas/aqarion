'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '201147007061';
  const defaultMessage = 'مرحباً، أريد الاستفسار عن عقار من موقع عقاريون المتحدة';
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform group"
      aria-label="تواصل واتساب"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-[#25D366]/40"
      />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 bg-navy-dark/90 backdrop-blur-md text-white text-xs font-cairo px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
        تواصل عبر واتساب
      </span>
    </motion.a>
  );
}
