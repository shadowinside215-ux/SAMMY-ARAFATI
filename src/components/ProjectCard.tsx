import React from 'react';
import { motion } from 'motion/react';
import { Globe, MapPin, Github, MonitorPlay } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../data/translations';

interface Project {
  id: string;
  name: string;
  image: string;
  description: Record<Language, string>;
  website?: string;
  demo?: string;
  maps?: string;
  source?: string;
}

interface ProjectCardProps {
  project: Project;
  type: 'website' | 'app';
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, type, index }) => {
  const { lang, t, isRtl } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-[#111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="h-48 relative flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden border-b border-white/5 bg-[#111]">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${project.image})` }} />
        <div className="absolute inset-0 bg-[#B30000]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-bold text-lg text-white">{project.name}</h3>
            {project.description?.[lang] && (
              <p className="text-sm text-white/50 leading-relaxed">
                {project.description[lang]}
              </p>
            )}
          </div>
          <span className={`px-2 py-1 text-[10px] rounded border font-mono flex-shrink-0 ${type === 'website' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-[#B30000]/10 text-[#B30000] border-[#B30000]/20'}`}>
            {type === 'website' ? 'PROD' : 'STAGING'}
          </span>
        </div>

        {/* Buttons (Vercel style) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 mt-auto">
          {type === 'website' && project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/5 text-[11px] rounded-md border border-white/10 hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
            >
              <Globe size={16} />
              {t.buttons.visitWebsite}
            </a>
          )}

          {type === 'app' && project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/5 text-[11px] rounded-md border border-white/10 hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
            >
              <MonitorPlay size={16} />
              {t.buttons.liveDemo}
            </a>
          )}

          {project.maps && (
            <a
              href={project.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/5 text-[11px] rounded-md border border-white/10 hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
            >
              <MapPin size={16} />
              {type === 'website' ? t.buttons.googleMaps : t.buttons.clientLocation}
            </a>
          )}

          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/5 text-[11px] rounded-md border border-white/10 hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
            >
              <Github size={16} />
              {t.buttons.source}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
