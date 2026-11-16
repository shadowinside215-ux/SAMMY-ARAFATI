import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  MapPin,
  Github,
  MonitorPlay,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../data/translations';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface ShowcaseProject {
  id: string;
  name: string;
  image: string;
  description: Record<Language, string>;
  website?: string;
  demo?: string;
  maps?: string;
  source?: string;
  type: 'website' | 'app';
  technologies?: string[];
  createdAt?: { toMillis: () => number };
}

export const ProjectsShowcase = () => {
  const { lang, t, isRtl } = useLanguage();
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [filter, setFilter] = useState<'all' | 'website' | 'app'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setFetchError(false);
        const snapshot = await getDocs(collection(db, 'projects'));
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ShowcaseProject[];

        const toTime = (val: ShowcaseProject['createdAt']) => {
          if (val && typeof val.toMillis === 'function') return val.toMillis();
          return 0;
        };

        items.sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt));

        setProjects(items);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  useEffect(() => {
    setActiveIndex(0);
  }, [filter]);

  const safeIndex =
    filteredProjects.length > 0 ? Math.min(activeIndex, filteredProjects.length - 1) : 0;
  const activeProject = filteredProjects[safeIndex] || null;

  const getDescription = (proj: ShowcaseProject) => {
    if (!proj.description) return '';
    if (typeof proj.description === 'string') return proj.description;
    return proj.description[lang] || proj.description.en || proj.description.fr || proj.description.ar || '';
  };

  const normalizeUrl = (raw?: string) => {
    if (!raw) return '';
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 10 });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  const goPrev = () => {
    if (filteredProjects.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  const goNext = () => {
    if (filteredProjects.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  return (
    <section id="projects" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-[#FF0000]/20">
      <div className="max-w-7xl mx-auto">
        {/* Header & Interactive Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <p className="text-sm font-mono uppercase tracking-[0.22em] text-[#FF2020] mb-3">
              01 · {t.sections.projects}
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white">
              {t.sections.projects}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#050505] border border-white/15 p-1 self-start md:self-auto max-w-full">
            {(
              [
                { id: 'all', label: t.projectsUI.all },
                { id: 'website', label: t.projectsUI.websites },
                { id: 'app', label: t.projectsUI.apps },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 text-xs font-display font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#FF0000] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-28 bg-[#050505]/90 border border-[#FF0000]/20 chamfer-card">
            <Loader2 className="animate-spin text-[#FF2020]" size={40} />
          </div>
        ) : fetchError ? (
          <div className="py-20 text-center text-neutral-300 bg-[#050505]/90 border border-[#FF0000]/40 chamfer-card">
            {t.projectsUI.error}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 bg-[#050505]/90 border border-dashed border-[#FF0000]/30 chamfer-card">
            {t.projectsUI.empty}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Primary 3D Holographic Stage */}
            <div
              ref={stageRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={resetTilt}
              style={{ perspective: '1400px' }}
            >
              <AnimatePresence mode="wait">
                {activeProject && (
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                      transition: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="bg-[#050505]/95 border border-[#FF0000]/45 red-glow-shadow chamfer-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative"
                  >
                    {/* Left: Large Visual 3D Preview Bay */}
                    <div className="lg:col-span-7 relative min-h-[220px] sm:min-h-[380px] bg-[#111111] overflow-hidden border-b lg:border-b-0 lg:border-e border-[#FF0000]/25 group">
                      {activeProject.image ? (
                        <img
                          src={activeProject.image}
                          alt={activeProject.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-500 p-8">
                          <Layers size={44} className="text-[#FF2020]/70" />
                          <span className="font-display text-lg text-white">{activeProject.name}</span>
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-[#000000]/30" />
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF2020] to-transparent animate-scan-sweep" />
                    </div>

                    {/* Right: Semantic Telemetry, Info & Functional Links */}
                    <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between gap-6">
                      <div>
                        <div className="flex items-center justify-between gap-4 text-xs font-mono text-neutral-400 mb-4">
                          <span className="text-[#FF2020]">
                            {activeProject.type === 'website'
                              ? t.projectsUI.websiteType
                              : t.projectsUI.appType}
                          </span>
                          <span className="tabular-nums">
                            {String(safeIndex + 1).padStart(2, '0')} /{' '}
                            {String(filteredProjects.length).padStart(2, '0')}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                          {activeProject.name}
                        </h3>

                        {getDescription(activeProject) && (
                          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
                            {getDescription(activeProject)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-5 pt-4 border-t border-white/10">
                        <div className="flex flex-wrap items-center gap-3">
                          {activeProject.website && (
                            <a
                              href={normalizeUrl(activeProject.website)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="chamfer-btn px-5 py-2.5 bg-[#FF0000] hover:bg-[#FF2020] text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                            >
                              <Globe size={15} />
                              <span>{t.buttons.visitWebsite}</span>
                            </a>
                          )}

                          {activeProject.demo && (
                            <a
                              href={normalizeUrl(activeProject.demo)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="chamfer-btn px-5 py-2.5 bg-[#FF0000] hover:bg-[#FF2020] text-white text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                            >
                              <MonitorPlay size={15} />
                              <span>{t.buttons.liveDemo}</span>
                            </a>
                          )}

                          {activeProject.maps && (
                            <a
                              href={normalizeUrl(activeProject.maps)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="chamfer-btn px-4 py-2.5 bg-[#111111] border border-[#FF0000]/40 hover:border-[#FF2020] text-white text-xs font-display font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                            >
                              <MapPin size={15} className="text-[#FF2020]" />
                              <span>
                                {activeProject.type === 'website'
                                  ? t.buttons.googleMaps
                                  : t.buttons.clientLocation}
                              </span>
                            </a>
                          )}

                          {activeProject.source && (
                            <a
                              href={normalizeUrl(activeProject.source)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="chamfer-btn px-4 py-2.5 bg-[#111111] border border-white/15 hover:border-[#FF2020] text-white text-xs font-display font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                            >
                              <Github size={15} />
                              <span>{t.buttons.source}</span>
                            </a>
                          )}
                        </div>

                        {filteredProjects.length > 1 && (
                          <div className="flex items-center justify-between pt-2">
                            <button
                              type="button"
                              onClick={goPrev}
                              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-neutral-300 hover:text-white border border-white/10 hover:border-[#FF2020] bg-[#111111] transition-colors cursor-pointer"
                            >
                              <ChevronLeft size={15} className={isRtl ? 'rotate-180' : ''} />
                              <span>{t.projectsUI.prev}</span>
                            </button>
                            <button
                              type="button"
                              onClick={goNext}
                              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-neutral-300 hover:text-white border border-white/10 hover:border-[#FF2020] bg-[#111111] transition-colors cursor-pointer"
                            >
                              <span>{t.projectsUI.next}</span>
                              <ChevronRight size={15} className={isRtl ? 'rotate-180' : ''} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Holo-Deck Project Selector Grid */}
            {filteredProjects.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProjects.map((project, idx) => {
                  const isSelected = idx === safeIndex;
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`text-start p-4 transition-all border chamfer-panel cursor-pointer flex items-center gap-4 ${
                        isSelected
                          ? 'bg-[#111111] border-[#FF2020] red-glow-shadow'
                          : 'bg-[#050505]/90 border-white/10 hover:border-[#FF0000]/50'
                      }`}
                    >
                      <div className="w-14 h-14 bg-[#111111] border border-white/10 overflow-hidden shrink-0">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Layers size={18} className="text-[#FF2020]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono text-[#FF2020] mb-0.5">
                          {project.type === 'website'
                            ? t.projectsUI.websiteType
                            : t.projectsUI.appType}
                        </div>
                        <div className="font-display font-bold text-sm text-white truncate">
                          {project.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
