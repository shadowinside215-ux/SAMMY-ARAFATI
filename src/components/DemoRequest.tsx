import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, MapPin, User, Building } from 'lucide-react';

export const DemoRequest = () => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    googleMaps: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.googleMaps) {
      alert('Google Maps link is required.');
      return;
    }

    const message = `Hello Sammy,\n\nI would like to request a free demo for my business.\n\nBusiness Name:\n${formData.businessName}\n\nOwner Name:\n${formData.ownerName}\n\nGoogle Maps:\n${formData.googleMaps}\n\nMessage:\n${formData.message || 'No message provided.'}`;
    
    const url = `https://wa.me/212774677692?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="demo" className="py-24 relative bg-[#090909]/40 border-y border-white/5">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            {t.demo.title}
          </h2>
          <p className="text-white/60">
            {t.demo.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 rounded-2xl border border-white/10 p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <Building size={16} /> {t.demo.businessName}
                </label>
                <input 
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000] transition-colors"
                  placeholder={t.demo.businessNamePlaceholder}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <User size={16} /> {t.demo.ownerName}
                </label>
                <input 
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000] transition-colors"
                  placeholder={t.demo.ownerNamePlaceholder}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <MapPin size={16} /> {t.demo.googleMaps}
              </label>
              <input 
                type="url"
                name="googleMaps"
                value={formData.googleMaps}
                onChange={handleChange}
                required
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000] transition-colors"
                placeholder={t.demo.googleMapsPlaceholder}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <MessageSquare size={16} /> {t.demo.message}
              </label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000] transition-colors resize-none"
                placeholder={t.demo.messagePlaceholder}
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-4 mt-2 bg-[#B30000] text-white font-bold rounded-lg hover:bg-[#e60000] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(179,0,0,0.3)]"
            >
              {t.demo.button}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
