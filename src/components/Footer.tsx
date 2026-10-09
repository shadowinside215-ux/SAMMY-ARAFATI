import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-8 px-6 flex flex-col md:flex-row items-center justify-between border-t border-white/5 bg-[#090909]/50 backdrop-blur-xl relative">
      <div className="flex items-center gap-6 mb-4 md:mb-0">
        <div className="flex flex-col text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white">{t.footer.name}</span>
          <span className="text-[10px] text-white/40">{t.footer.tagline}</span>
        </div>
        <div className="hidden md:block h-6 w-[1px] bg-white/10"></div>
        <div className="hidden md:flex gap-4 items-center">
          <a href="https://wa.me/212774677692" target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/60 hover:text-white transition-colors">WhatsApp</a>
          <a href="mailto:samiarafati3@gmail.com" className="text-[10px] text-white/60 hover:text-white transition-colors">Email</a>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-xs font-medium">
        <div className="flex items-center gap-2 text-white/40">
          <span>Based in</span>
          <span className="flex items-center gap-1.5 text-white/70">🇲🇦 {t.footer.location}</span>
        </div>
      </div>
    </footer>
  );
};
