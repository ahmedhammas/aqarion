'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Fetch settings from API for live sync
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        const settings = data.settings;
        if (settings) {
          setText(settings.announcement_text || '');
          setIsActive(settings.announcement_active === 'true');
        }
      })
      .catch(() => {
        // Fallback to default
        setText('عروض حصرية على فيلل الساحل الشمالي | تواصل الآن');
        setIsActive(true);
      });

    try {
      const dismissed = sessionStorage.getItem('aqarion_announcement_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('aqarion_announcement_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  if (!isActive || !text) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden relative z-[60]"
          style={{
            background: 'linear-gradient(135deg, #C58B5B 0%, #d4a76a 50%, #a5713d 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-white" />
            <p className="font-cairo text-sm font-medium text-center text-white">
              {text}
            </p>
            <button
              onClick={dismiss}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
