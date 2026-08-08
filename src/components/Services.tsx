import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Monitor, ShoppingCart, Smartphone, MapPin, CheckCircle2 } from 'lucide-react';

export const Services = () => {
  const { t } = useLanguage();
  const icons = [Monitor, ShoppingCart, Smartphone, MapPin];

  return (
    <section id="services" className="py-24 relative bg-[#090909]/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t.sections.services}
          </h2>
          <div className="w-24 h-1 bg-[#B30000] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.map((service: any, index: number) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-[#111] rounded-2xl border border-white/10 hover:border-white/20 transition-colors group flex flex-col h-full relative overflow-hidden shadow-xl"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B30000]/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="p-3 bg-white/5 rounded-xl text-[#B30000]">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>
                
                <div className="mb-6 relative z-10 border-b border-white/5 pb-6">
                  {service.priceType === 'starting-monthly' ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                         <span className="text-sm text-white/50">{t.pricing?.from || 'from'}</span>
                         <span className="text-3xl font-bold text-white">{service.setupPrice}</span>
                      </div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xl font-bold text-[#B30000]">+{service.monthlyPrice}</span>
                        <span className="text-sm text-white/50">/{t.pricing?.month || 'month'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{service.price}</span>
                      {service.priceType === 'monthly' && (
                        <span className="text-sm text-white/50">/{t.pricing?.month || 'month'}</span>
                      )}
                    </div>
                  )}
                  <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#B30000] bg-[#B30000]/10 inline-block px-2 py-1 rounded border border-[#B30000]/20">
                    {service.priceType === 'one-time' && (t.pricing?.oneTime || 'One-time price')}
                    {service.priceType === 'monthly' && (t.pricing?.recurring || 'Recurring price')}
                    {service.priceType === 'starting-monthly' && (t.pricing?.setupAndMonthly || 'Setup + Monthly')}
                  </div>
                </div>

                <ul className="space-y-4 mb-6 flex-grow relative z-10">
                  {service.features.map((feature: string, fIndex: number) => (
                    <li key={fIndex} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                      <CheckCircle2 size={16} className="text-[#B30000] shrink-0 mt-0.5 opacity-80" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
