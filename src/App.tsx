import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { Services } from './components/Services';
import { WhyMe } from './components/WhyMe';
import { Contact } from './components/Contact';
import { DemoRequest } from './components/DemoRequest';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';

const Portfolio = () => (
  <div className="min-h-screen bg-[#090909] text-white relative overflow-hidden flex flex-col selection:bg-accent/30 selection:text-white">
    {/* Background Glows */}
    <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#B30000] opacity-10 blur-[120px] rounded-full pointer-events-none z-0"></div>
    <div className="fixed bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#B30000] opacity-5 blur-[100px] rounded-full pointer-events-none z-0"></div>
    
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProjectsSection type="website" />
        <ProjectsSection type="app" />
        <Services />
        <WhyMe />
        <DemoRequest />
        <Contact />
      </main>
      <Footer />
    </div>
  </div>
);

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </LanguageProvider>
  );
}
