import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-8 px-6 flex flex-col md:flex-row items-center justify-between border-t border-white/5 bg-[#090909]/50 backdrop-blur-xl">
      <div className="flex items-center gap-6 mb-4 md:mb-0">
        <div className="flex flex-col text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white">{t.footer.name}</span>
          <span className="text-[10px] text-white/40">{t.footer.tagline}</span>
        </div>
        <div className="hidden md:block h-6 w-[1px] bg-white/10"></div>
        <div className="hidden md:flex gap-4">
          <span className="text-[10px] text-white/60 hover:text-white cursor-pointer transition-colors">WhatsApp</span>
          <span className="text-[10px] text-white/60 hover:text-white cursor-pointer transition-colors">Email</span>
          <a href="/admin/login" className="text-[10px] text-white/60 hover:text-white cursor-pointer transition-colors">Admin</a>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs font-medium">
        <span className="text-white/40">Based in</span>
        <span className="flex items-center gap-2">🇲🇦 {t.footer.location}</span>
      </div>
    </footer>
  );
};
