import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Monitor,
  ShoppingCart,
  Smartphone,
  Laptop,
  Globe,
  CheckCircle2,
  Cpu,
  Layers,
  Workflow,
  Box,
  Code2,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ServiceHoloCanvas } from '../three/ServiceHoloCanvas';

interface ServicePricingItem {
  title: string;
  price: string;
  priceType: string;
  isNegotiable?: boolean;
  setupPrice?: string;
  monthlyPrice?: string;
  features: string[];
}

export const Services = () => {
  const { t } = useLanguage();
  const [activeCapability, setActiveCapability] = useState(0);

  const capabilityIcons = [Globe, Code2, Cpu, Workflow, Layers, Box];
  const pricingIcons = [Monitor, ShoppingCart, Globe, Laptop, Smartphone, MapPin];

  const currentCap = t.capabilities[activeCapability] || t.capabilities[0];

  return (
    <section id="services" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-[#FF0000]/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mb-14">
          <p className="text-sm font-mono uppercase tracking-[0.22em] text-[#FF2020] mb-3">
            02 · {t.sections.services}
          </p>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white">
            {t.sections.services}
          </h2>
        </div>

        {/* Interactive 6-Capability Matrix + Live 3D Holographic Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
          {/* Left: 6 Interactive Service Selectors */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.capabilities.map((cap, idx) => {
              const Icon = capabilityIcons[idx % capabilityIcons.length];
              const isActive = idx === activeCapability;
              return (
                <button
                  key={cap.title}
                  type="button"
                  onClick={() => setActiveCapability(idx)}
                  onMouseEnter={() => setActiveCapability(idx)}
                  className={`text-start p-6 border transition-all chamfer-panel cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden ${
                    isActive
                      ? 'bg-[#111111] border-[#FF2020] red-glow-shadow'
                      : 'bg-[#050505]/92 border-white/10 hover:border-[#FF0000]/45'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`p-2.5 border ${
                        isActive
                          ? 'bg-[#8B0000]/30 border-[#FF2020] text-[#FF2020]'
                          : 'bg-[#111111] border-white/10 text-neutral-300'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-xs text-neutral-500 tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">
                      {cap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {cap.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Dedicated Live 3D Holographic Sculpture Viewport */}
          <div className="lg:col-span-5 bg-[#050505]/95 border border-[#FF0000]/40 red-glow-shadow chamfer-card p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[340px] sm:min-h-[420px]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF2020] to-transparent animate-scan-sweep" />

            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-white/10 pb-3">
              <span className="text-[#FF2020]">3D HOLOGRAPHIC PREVIEW</span>
              <span className="tabular-nums">MODULE 0{activeCapability + 1}</span>
            </div>

            <div className="flex-1 relative min-h-[260px] my-2">
              <ServiceHoloCanvas activeIndex={activeCapability} />
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="font-display font-bold text-xl text-white mb-2">
                {currentCap.title}
              </h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-neutral-300">
                {currentCap.specs.map((spec, sIdx) => (
                  <React.Fragment key={spec}>
                    {sIdx > 0 && <span className="text-[#FF2020]" aria-hidden="true">/</span>}
                    <span>{spec}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transparent DH Pricing Matrix */}
        <div className="pt-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF2020] mb-2">
                {t.sections.pricingTitle}
              </p>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {t.sections.pricingTitle}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(t.services as ServicePricingItem[]).map((service, index) => {
              const Icon = pricingIcons[index % pricingIcons.length];
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="p-6 bg-[#050505]/95 border border-white/12 hover:border-[#FF2020] transition-colors group flex flex-col h-full relative overflow-hidden chamfer-panel"
                >
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="p-2.5 bg-[#111111] border border-[#FF0000]/30 text-[#FF2020] shrink-0">
                      <Icon size={20} />
                    </div>
                    <h4 className="text-base font-display font-bold text-white leading-snug">
                      {service.title}
                    </h4>
                  </div>

                  <div className="mb-5 border-b border-white/10 pb-5">
                    {service.priceType === 'starting-monthly' ? (
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-mono text-neutral-400">
                            {t.pricing.from}
                          </span>
                          <span className="text-2xl font-display font-bold text-white tabular-nums">
                            {service.setupPrice}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-lg font-display font-bold text-[#FF2020] tabular-nums">
                            +{service.monthlyPrice}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">
                            /{t.pricing.month}
                          </span>
                        </div>
                      </div>
                    ) : service.priceType === 'starting-one-time' ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-mono text-neutral-400">
                          {t.pricing.from}
                        </span>
                        <span className="text-2xl font-display font-bold text-white tabular-nums">
                          {service.price}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-display font-bold text-white tabular-nums">
                          {service.price}
                        </span>
                        {service.priceType === 'monthly' && (
                          <span className="text-xs font-mono text-neutral-400">
                            /{t.pricing.month}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Clean unboxed typographic metadata (strictly red/white) */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono uppercase tracking-wider">
                      <span className="text-[#FF2020]">
                        {(service.priceType === 'one-time' || service.priceType === 'starting-one-time') &&
                          t.pricing.oneTime}
                        {service.priceType === 'monthly' && t.pricing.recurring}
                        {service.priceType === 'starting-monthly' && t.pricing.setupAndMonthly}
                      </span>
                      {service.isNegotiable && (
                        <>
                          <span className="text-neutral-600" aria-hidden="true">·</span>
                          <span className="text-white font-semibold">
                            {t.pricing.negotiable}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 flex-grow">
                    {service.features.map((feature: string, fIndex: number) => (
                      <li
                        key={fIndex}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed"
                      >
                        <CheckCircle2 size={15} className="text-[#FF2020] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
