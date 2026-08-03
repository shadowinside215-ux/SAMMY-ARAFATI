import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Zap, Layout, TrendingUp, Settings } from 'lucide-react';

export const WhyMe = () => {
  const { t } = useLanguage();

  const icons = [Settings, Zap, Layout, TrendingUp];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 tracking-tight text-center">
          {t.sections.whyMe}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.whyMe.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 flex flex-col items-center text-center transition-colors group"
              >
                <div className="mb-4 text-white/50 group-hover:text-white transition-colors duration-300">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
