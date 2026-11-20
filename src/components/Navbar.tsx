import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../data/translations';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().logoUrl) {
          setLogoUrl(docSnap.data().logoUrl);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogo();
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.contact, href: '#contact' },
  ];

  const languages: { code: Language; flag: string }[] = [
    { code: 'en', flag: 'EN' },
    { code: 'fr', flag: 'FR' },
    { code: 'ar', flag: 'AR' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#050505]/95 border-b border-[#FF0000]/30 py-3.5'
          : 'bg-gradient-to-b from-[#000000]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Brand Logo & Name visible on both mobile and desktop with glowing red illumination */}
        <a
          href="#home"
          className="text-[13px] sm:text-base md:text-lg font-display font-bold tracking-wide sm:tracking-wider uppercase text-[#FF2020] red-text-glow flex items-center gap-2.5 sm:gap-3 min-w-0 focus-visible:outline focus-visible:outline-[#FF2020] group"
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Sami's Digital Solutions"
              referrerPolicy="no-referrer"
              onError={() => setLogoUrl(null)}
              className="h-8 sm:h-10 md:h-11 w-auto object-contain shrink-0 drop-shadow-[0_0_14px_rgba(255,32,32,0.85)] transition-transform duration-200 group-hover:scale-[1.03]"
            />
          )}
          <span className="text-[#FF2020] drop-shadow-[0_0_14px_rgba(255,32,32,0.85)] truncate">
            Sami&apos;s Digital Solutions
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium text-neutral-300 hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 group focus-visible:outline focus-visible:outline-[#FF2020]"
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FF2020] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Switcher + Primary Action */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <div className="flex items-center border border-white/15 bg-[#050505] p-0.5">
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1 text-xs font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === l.code
                    ? 'bg-[#8B0000] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {l.flag}
              </button>
            ))}
          </div>

          <a
            href="#contact"
            className="chamfer-btn px-5 py-2.5 bg-[#FF0000] hover:bg-[#FF2020] text-white text-xs font-display font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 red-glow-shadow"
          >
            {t.nav.cta}
          </a>
        </div>

        {/* Mobile & Tablet Toggle */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="lg:hidden shrink-0 text-white p-2.5 border border-[#FF0000]/40 bg-[#050505] hover:border-[#FF2020] transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050505] border-b border-[#FF0000]/30 px-5 py-6 flex flex-col gap-5">
          <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-200 hover:text-[#FF2020] py-2.5 border-b border-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="chamfer-btn mt-3 px-5 py-3.5 bg-[#FF0000] text-white text-center text-sm font-display font-bold uppercase tracking-wider"
            >
              {t.nav.cta}
            </a>
          </nav>

          <div className="flex items-center gap-2 pt-2">
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLang(l.code);
                  setMobileMenuOpen(false);
                }}
                className={`px-3.5 py-2 text-xs font-mono border transition-colors cursor-pointer ${
                  lang === l.code
                    ? 'bg-[#8B0000] border-[#FF2020] text-white'
                    : 'bg-[#111111] border-white/10 text-neutral-400'
                }`}
              >
                {l.flag}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
