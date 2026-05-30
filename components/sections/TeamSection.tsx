'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, MessageCircle } from 'lucide-react';
import { fadeUp } from '@/lib/animations';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  whatsapp: string;
  is_active: boolean;
  display_order: number;
}

export default function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch('/api/admin/team')
      .then(r => r.json())
      .then(d => {
        const active = (d.team || [])
          .filter((m: TeamMember) => m.is_active)
          .sort((a: TeamMember, b: TeamMember) => a.display_order - b.display_order);
        setMembers(active);
      })
      .catch(() => {});
  }, []);

  if (members.length === 0) return null;

  return (
    <section id="team" className="py-24 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="font-cairo text-gold font-semibold tracking-wider">فريقنا</span>
            <div className="w-12 h-px bg-gold" />
          </motion.div>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
            className="section-title text-3xl md:text-5xl text-white mb-6">
            تعرّف على <span className="gold-gradient-text">فريقنا</span> المتميز
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}
            className="font-cairo text-white/60 text-lg leading-relaxed">
            فريق من الخبراء المتخصصين في السوق العقاري المصري، ملتزمون بتقديم أفضل خدمة لعملائنا.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <motion.div key={member.id} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={index * 0.15}
              className="glass-card rounded-3xl p-8 text-center group hover:-translate-y-3 transition-all duration-500 border border-gold/10 hover:border-gold/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10">
                <div className="relative w-28 h-28 mx-auto mb-6">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover border-2 border-gold/40 group-hover:border-gold transition-colors duration-300" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gold/20 flex items-center justify-center text-gold font-cairo font-bold text-3xl border-2 border-gold/40">
                      {member.name?.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-green-400 border-2 border-navy-dark" />
                </div>
                <h3 className="font-cairo font-bold text-xl text-white mb-1 group-hover:text-gold transition-colors">{member.name}</h3>
                <p className="font-cairo text-gold/80 text-sm mb-4">{member.role}</p>
                <p className="font-cairo text-white/50 text-sm leading-relaxed mb-6">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <a href="#" className="w-10 h-10 rounded-full glass-card-dark flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/50 transition-all border border-transparent hover:border-gold/30">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={member.whatsapp ? `https://wa.me/${member.whatsapp}` : '#'} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass-card-dark flex items-center justify-center text-white/50 hover:text-green-400 hover:border-green-400/50 transition-all border border-transparent hover:border-green-400/30">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
