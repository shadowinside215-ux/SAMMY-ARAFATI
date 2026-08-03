import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail } from 'lucide-react';

export const Hero = () => {
  const { t, isRtl } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-8 leading-[1.1]">
            {t.hero.headline.split(/(Websites|Sites Web|مواقع الويب)/).map((part, i) => 
               /(Websites|Sites Web|مواقع الويب)/.test(part) ? <span key={i} className="text-[#B30000]">{part}</span> : part
            )}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          <p className="text-lg md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#websites"
            className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            {t.hero.primaryBtn}
            <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Mail size={20} />
            {t.hero.secondaryBtn}
          </a>
        </motion.div>
      </div>
    </section>
  );
};
