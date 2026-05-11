import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020a18] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
      
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Building/Logo Placeholder */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-gold/20 rounded-xl" />
          <div className="absolute inset-0 border-4 border-gold rounded-xl border-t-transparent animate-spin" />
          
          <div className="absolute inset-4 flex items-end justify-center gap-1">
            <div className="w-2 bg-gold/50 rounded-t-sm animate-[pulse_1.5s_ease-in-out_infinite]" style={{ height: '40%' }} />
            <div className="w-2 bg-gold/80 rounded-t-sm animate-[pulse_1.5s_ease-in-out_0.2s_infinite]" style={{ height: '80%' }} />
            <div className="w-2 bg-gold/50 rounded-t-sm animate-[pulse_1.5s_ease-in-out_0.4s_infinite]" style={{ height: '60%' }} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-cairo font-bold text-white tracking-wide">
            عقاريون <span className="text-gold">المتحدة</span>
          </h2>
          <p className="text-gray-400 font-cairo text-sm animate-pulse">
            جاري تجهيز العقارات...
          </p>
        </div>
      </div>
    </div>
  );
}
