import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { LanguageProvider } from './context/LanguageContext';
import { FuturisticCanvas } from './three/FuturisticCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutMe } from './components/AboutMe';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { Services } from './components/Services';
import { ContactTerminal } from './components/ContactTerminal';
import { Footer } from './components/Footer';
import { prefersReducedMotion } from './three/webglUtils';

const AdminDashboard = lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminLogin = lazy(() =>
  import('./components/admin/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);

const Portfolio = () => {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const updateNativeScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgressRef.current = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    window.addEventListener('scroll', updateNativeScroll, { passive: true });
    window.addEventListener('resize', updateNativeScroll, { passive: true });
    updateNativeScroll();

    if (prefersReducedMotion()) {
      return () => {
        window.removeEventListener('scroll', updateNativeScroll);
        window.removeEventListener('resize', updateNativeScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      infinite: false,
    });

    lenis.on('scroll', () => {
      updateNativeScroll();
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateNativeScroll);
      window.removeEventListener('resize', updateNativeScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-x-hidden flex flex-col selection:bg-[#FF0000]/40 selection:text-white">
      {/* Persistent Real-Time Three.js 3D Machine Backdrop */}
      <FuturisticCanvas scrollProgressRef={scrollProgressRef} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <AboutMe />
          <ProjectsShowcase />
          <Services />
          <ContactTerminal />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#000000] flex items-center justify-center text-[#FF2020] font-mono text-xs uppercase tracking-widest">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </LanguageProvider>
  );
}
