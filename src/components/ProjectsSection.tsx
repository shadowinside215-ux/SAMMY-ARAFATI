import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ProjectCard } from './ProjectCard';
import { Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface ProjectsSectionProps {
  type: 'website' | 'app';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ type }) => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(
          collection(db, 'projects'),
          where('type', '==', type)
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by createdAt client-side since we don't have an index yet
        data.sort((a: any, b: any) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        });
        
        setProjects(data as any);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [type]);
  
  const title = type === 'website' ? t.sections.websites : t.sections.apps;

  return (
    <section id={type === 'website' ? 'websites' : 'apps'} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
          {title}
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#B30000]" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any, index: number) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                type={type} 
                index={index} 
              />
            ))}
            {projects.length === 0 && (
              <div className="col-span-full py-12 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">
                No projects found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
