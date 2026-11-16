import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 w-full py-8 px-6 border-t border-[#FF0000]/25 bg-[#050505]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-start">
          <div>
            <div className="text-xs font-display font-bold uppercase tracking-widest text-[#FF2020] drop-shadow-[0_0_12px_rgba(255,32,32,0.8)]">
              {t.footer.name}
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">{t.footer.tagline}</div>
          </div>

          <div className="hidden sm:block h-5 w-px bg-white/15" />

          <div className="flex items-center gap-5 text-xs font-mono">
            <a
              href="https://wa.me/212774677692"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-[#FF2020] transition-colors"
            >
              {t.buttons.whatsapp}
            </a>
            <a
              href="mailto:samiarafati3@gmail.com"
              className="text-neutral-300 hover:text-[#FF2020] transition-colors"
            >
              {t.buttons.email}
            </a>
          </div>
        </div>

        <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
          <span className="text-[#FF2020]">·</span>
          <span>{t.footer.location}</span>
        </div>
      </div>
    </footer>
  );
};
