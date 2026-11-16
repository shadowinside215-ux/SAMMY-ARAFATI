import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const CODE_STREAM_LINES = [
  'export interface SystemCore {',
  '  architecture: "modular";',
  '  rendering: "spatial_3d";',
  '  persistence: "realtime_cloud";',
  '  latencyBudgetMs: 16.6;',
  '}',
  'function compileDigitalSolution(spec: Spec) {',
  '  const pipeline = createRealtimePipeline(spec);',
  '  return pipeline.deploy({ zeroDowntime: true });',
  '}',
  'const interfaceNode = new SpatialModule();',
  'interfaceNode.rotation.y += delta * 0.42;',
  'export interface SystemCore {',
  '  architecture: "modular";',
  '  rendering: "spatial_3d";',
  '  persistence: "realtime_cloud";',
  '  latencyBudgetMs: 16.6;',
  '}',
];

export const AboutMe = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-[#FF0000]/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-stretch">
          {/* Left: Typography-Driven Identity Statement */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-between bg-[#050505]/92 border border-white/10 p-6 sm:p-12 relative overflow-hidden chamfer-card"
          >
            {/* Red vertical laser scanner line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF2020] to-transparent animate-scan-sweep" />

            <div>
              <h2 className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-[#FF2020] mb-4 sm:mb-5">
                {t.about.title} · {t.about.role}
              </h2>
              <p
                className="text-xl sm:text-3xl lg:text-[2.15rem] font-display font-semibold text-white leading-[1.35] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {t.about.lead}
              </p>
            </div>

            {/* 4 Real Architectural Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
              {t.about.pillars.map((pillar, idx) => (
                <div key={pillar.title} className="space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#FF2020] tabular-nums">
                    <span>0{idx + 1}.</span>
                    <span className="font-display font-semibold text-sm text-white uppercase tracking-wide">
                      {pillar.title}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Holographic Technical Diagram + Code Data Stream */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Holographic SVG Technical Diagram */}
            <div className="bg-[#050505]/92 border border-[#FF0000]/30 p-6 relative overflow-hidden chamfer-panel flex-1 flex flex-col justify-between min-h-[260px]">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-4">
                <span className="text-[#FF2020]">SYSTEM SCHEMATIC</span>
                <span>CUSTOM ARCHITECTURE</span>
              </div>

              <div className="relative flex items-center justify-center my-2">
                <svg
                  viewBox="0 0 360 180"
                  className="w-full max-w-[340px] h-auto"
                  aria-hidden="true"
                >
                  {/* Grid lines */}
                  <line x1="20" y1="90" x2="340" y2="90" stroke="#8B0000" strokeOpacity="0.45" strokeDasharray="4 4" />
                  <line x1="180" y1="12" x2="180" y2="168" stroke="#8B0000" strokeOpacity="0.45" strokeDasharray="4 4" />
                  {/* Concentric target arcs */}
                  <circle cx="180" cy="90" r="68" fill="none" stroke="#8B0000" strokeWidth="1" />
                  <circle cx="180" cy="90" r="46" fill="none" stroke="#FF0000" strokeWidth="1.5" strokeDasharray="18 8" />
                  <circle cx="180" cy="90" r="22" fill="#111111" stroke="#FF2020" strokeWidth="2" />
                  {/* Data bus nodes */}
                  <polyline points="28,45 96,45 128,74" fill="none" stroke="#FF2020" strokeWidth="1.5" />
                  <polyline points="332,45 264,45 232,74" fill="none" stroke="#FF2020" strokeWidth="1.5" />
                  <polyline points="28,135 96,135 128,106" fill="none" stroke="#FF0000" strokeWidth="1.5" />
                  <polyline points="332,135 264,135 232,106" fill="none" stroke="#FF0000" strokeWidth="1.5" />
                  <rect x="20" y="40" width="10" height="10" fill="#FF2020" />
                  <rect x="330" y="40" width="10" height="10" fill="#FF2020" />
                  <rect x="20" y="130" width="10" height="10" fill="#8B0000" />
                  <rect x="330" y="130" width="10" height="10" fill="#8B0000" />
                  <circle cx="180" cy="90" r="5" fill="#FF2020" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-3 border-t border-white/10">
                <span>DIGITAL INFRASTRUCTURE</span>
                <span className="text-[#FF2020]">MODULAR SYSTEMS</span>
              </div>
            </div>

            {/* Live Flowing Code Stream Panel */}
            <div className="bg-[#050505]/92 border border-white/10 p-5 relative overflow-hidden h-52 chamfer-panel">
              <div className="text-[11px] font-mono text-[#FF2020] mb-3 uppercase tracking-wider">
                Source Execution Stream
              </div>
              <div className="h-36 overflow-hidden relative">
                <div className="animate-data-scroll font-mono text-xs leading-6 text-neutral-400">
                  {CODE_STREAM_LINES.map((line, i) => (
                    <div key={i} className={i % 3 === 0 ? 'text-neutral-200' : 'text-[#FF2020]/80'}>
                      <span className="text-neutral-600 mr-3 select-none tabular-nums">
                        {String((i % 12) + 1).padStart(2, '0')}
                      </span>
                      {line}
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#050505] to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
