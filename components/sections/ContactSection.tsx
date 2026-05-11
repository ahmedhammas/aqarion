'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Send, X, Building2, CheckCircle, Loader2 } from 'lucide-react';
import { fadeUp } from '@/lib/animations';

const locations = [
  {
    id: 1,
    name: 'الفرع الرئيسي',
    city: 'القاهرة',
    top: '45%',
    left: '50%',
    address: 'التجمع الخامس، شارع التسعين',
  },
  {
    id: 2,
    name: 'فرع أكتوبر',
    city: 'الشيخ زايد',
    top: '55%',
    left: '35%',
    address: 'أركان بلازا، المحور المركزي',
  },
  {
    id: 3,
    name: 'فرع الساحل',
    city: 'الساحل الشمالي',
    top: '25%',
    left: '25%',
    address: 'مارينا 5، طريق العلمين',
  },
];

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactSection() {
  const [activeLocation, setActiveLocation] = useState<(typeof locations)[0] | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.message) {
      setFormStatus('error');
      setErrorMessage('يرجى ملء جميع الحقول');
      return;
    }

    setFormStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormStatus('success');
        setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' });
      } else {
        setFormStatus('error');
        setErrorMessage(data.error || 'حدث خطأ غير متوقع');
      }
    } catch {
      setFormStatus('error');
      setErrorMessage('حدث خطأ في الاتصال بالسيرفر');
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#020a18] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="w-12 h-px bg-gold" />
            <span className="font-cairo text-gold font-semibold tracking-wider">تواصل معنا</span>
            <div className="w-12 h-px bg-gold" />
          </motion.div>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
            className="section-title text-3xl md:text-5xl text-white mb-6"
          >
            دعنا نساعدك في إيجاد <span className="gold-gradient-text">عقارك</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card-dark rounded-[2rem] p-6 lg:p-8 border border-gold/20"
          >
            <div className="rounded-2xl overflow-hidden h-[350px] mb-8 relative border border-white/10 group bg-navy-dark">
              <div className="absolute inset-0 pointer-events-none opacity-60">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.60389552709!2d31.25846435!3d30.059618499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(1) invert(0.9) hue-rotate(200deg)' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Company Location Background"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-tr from-[#020a18] via-transparent to-[#020a18]/40 pointer-events-none" />

              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ top: loc.top, left: loc.left }}
                  onClick={() => setActiveLocation(loc)}
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gold rounded-full blur-md"
                  />
                  <div className="relative w-4 h-4 bg-white border-2 border-gold rounded-full shadow-[0_0_15px_rgba(197,139,91,0.8)]" />
                </div>
              ))}

              <AnimatePresence>
                {activeLocation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute z-30 bottom-4 left-4 right-4 glass-card p-4 rounded-xl border border-gold/40 shadow-gold"
                  >
                    <button
                      onClick={() => setActiveLocation(null)}
                      className="absolute top-2 left-2 text-white/50 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-cairo font-bold text-white text-sm">{activeLocation.name}</h4>
                        <div className="flex items-center gap-1 mt-1 text-white/60">
                          <MapPin className="w-3 h-3 text-gold" />
                          <span className="font-cairo text-xs">{activeLocation.address}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'العنوان', text: 'القاهرة، التجمع الخامس، شارع التسعين' },
                { icon: Phone, title: 'الهاتف', text: '+20 123 456 7890', ltr: true },
                { icon: Mail, title: 'البريد الإلكتروني', text: 'info@aqarion.com', ltr: true },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-cairo text-white/50 text-sm mb-1">{item.title}</p>
                    <p className={`font-cairo font-bold text-white text-lg ${item.ltr ? 'dir-ltr text-left' : ''}`}>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card rounded-[2rem] p-8 lg:p-10"
          >
            <h3 className="font-cairo font-bold text-2xl text-white mb-8">أرسل لنا رسالة</h3>

            <AnimatePresence mode="wait">
              {formStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h4 className="font-cairo font-bold text-2xl text-white mb-3">شكراً لتواصلك!</h4>
                  <p className="font-cairo text-white/60 text-lg mb-8">سنتواصل معك في أقرب وقت ممكن ✓</p>
                  <button
                    onClick={() => setFormStatus('idle')}
                    className="btn-outline-gold px-8 py-3 rounded-2xl font-cairo font-bold"
                  >
                    إرسال رسالة أخرى
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-cairo text-sm text-white/70 mb-2">الاسم الأول</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm"
                        placeholder="أدخل اسمك"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-cairo text-sm text-white/70 mb-2">اسم العائلة</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm"
                        placeholder="أدخل اسم العائلة"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cairo text-sm text-white/70 mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left dir-ltr"
                      placeholder="+20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-cairo text-sm text-white/70 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm text-left dir-ltr"
                      placeholder="example@domain.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-cairo text-sm text-white/70 mb-2">رسالتك</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full input-luxury rounded-xl py-3 px-4 font-cairo text-sm min-h-[120px] resize-none"
                      placeholder="كيف يمكننا مساعدتك؟"
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {formStatus === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-cairo text-red-400 text-sm text-center bg-red-400/10 rounded-xl py-3 border border-red-400/20"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-xl font-cairo font-bold text-lg mt-4 group disabled:opacity-70"
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        إرسال الرسالة
                        <Send className="w-5 h-5 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform rtl:-scale-x-100" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
