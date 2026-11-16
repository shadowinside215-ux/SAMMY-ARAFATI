import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Terminal } from 'lucide-react';

export const Hero = () => {
  const { t, isRtl } = useLanguage();

  const accentText = t.hero.headlineAccent;
  const parts = t.hero.headline.split(accentText);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-14 sm:pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Subtle architectural reticle corners framing the 3D machine core */}
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="relative py-10 sm:py-16 md:py-24 px-3 sm:px-10 text-center">
          {/* Corner crosshair brackets */}
          <span className="hidden sm:block absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-[#FF0000]/70 pointer-events-none" />
          <span className="hidden sm:block absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-[#FF0000]/70 pointer-events-none" />
          <span className="hidden sm:block absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-[#FF0000]/70 pointer-events-none" />
          <span className="hidden sm:block absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-[#FF0000]/70 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-[#FF2020] red-text-glow mb-4">
              {t.hero.roleLine}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="text-3xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-6 sm:mb-7 leading-[1.08] max-w-4xl mx-auto"
              style={{ textWrap: 'balance' }}
            >
              {parts.length > 1 ? (
                <>
                  {parts[0]}
                  <span className="text-[#FF2020] red-text-glow">{accentText}</span>
                  {parts[1]}
                </>
              ) : (
                t.hero.headline
              )}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm sm:text-xl text-neutral-300 mb-9 sm:mb-11 max-w-2xl mx-auto leading-relaxed px-1 sm:px-0">
              {t.hero.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
          >
            <a
              href="#projects"
              className="chamfer-btn w-full sm:w-auto min-h-[48px] px-8 py-4 bg-[#FF0000] hover:bg-[#FF2020] text-white font-display font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 red-glow-shadow whitespace-nowrap shrink-0"
            >
              <span>{t.hero.primaryBtn}</span>
              <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
            </a>
            <a
              href="#contact"
              className="chamfer-btn w-full sm:w-auto min-h-[48px] px-8 py-4 bg-[#050505]/90 border border-[#FF0000]/50 hover:border-[#FF2020] hover:bg-[#111111] text-white font-display font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0"
            >
              <Terminal size={17} className="text-[#FF2020]" />
              <span>{t.hero.secondaryBtn}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
