import React, { useState } from 'react';
import { Mail, MessageSquare, User, Building, Send, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TechWindow } from './TechWindow';

export const ContactTerminal = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    message: '',
  });
  const [transmittedUrl, setTransmittedUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildWhatsAppUrl = () => {
    const business = formData.businessName.trim();
    const owner = formData.ownerName.trim();
    const details = formData.message.trim();
    const message = `Hello Sami,\n\nI would like to discuss a project.\n\nBusiness Name:\n${business}\n\nName:\n${owner}\n\nMessage:\n${details || 'No additional details provided.'}`;
    return `https://wa.me/212774677692?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim() || !formData.ownerName.trim()) {
      return;
    }
    const url = buildWhatsAppUrl();
    setTransmittedUrl(url);

    // Programmatic anchor dispatch (safer than window.open in iframe contexts)
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-[#FF0000]/25 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Glowing Red Communication Core Visual */}
        <TechWindow className="text-center mb-14 relative">
          {/* Central Signal Core SVG */}
          <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <span className="absolute inset-0 border border-[#FF0000]/45 rounded-full animate-signal-expand pointer-events-none" />
            <span
              className="absolute inset-2 border border-[#FF2020]/50 rounded-full animate-signal-expand pointer-events-none"
              style={{ animationDelay: '1.1s' }}
            />
            <div className="w-12 h-12 bg-[#111111] border-2 border-[#FF2020] rotate-45 flex items-center justify-center red-glow-shadow">
              <div className="w-4 h-4 bg-[#FF0000]" />
            </div>
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white mb-4"
            style={{ textWrap: 'balance' }}
          >
            {t.demo.headline}
          </h2>
          <p className="text-lg sm:text-xl text-neutral-300 max-w-xl mx-auto">
            {t.demo.subtitle}
          </p>
        </TechWindow>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Futuristic Interactive Transmission Form */}
          <TechWindow delay={0.06} className="lg:col-span-7">
            <div className="h-full bg-[#050505]/95 border border-[#FF0000]/40 p-6 sm:p-10 chamfer-card red-glow-shadow relative overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF2020] to-transparent animate-scan-sweep" />

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="businessName"
                      className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-2"
                    >
                      <Building size={14} className="text-[#FF2020]" />
                      <span>{t.demo.businessName}</span>
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      placeholder={t.demo.businessNamePlaceholder}
                      className="bg-[#111111] border border-white/15 px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FF2020] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="ownerName"
                      className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-2"
                    >
                      <User size={14} className="text-[#FF2020]" />
                      <span>{t.demo.ownerName}</span>
                    </label>
                    <input
                      id="ownerName"
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                      placeholder={t.demo.ownerNamePlaceholder}
                      className="bg-[#111111] border border-white/15 px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FF2020] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-2"
                  >
                    <MessageSquare size={14} className="text-[#FF2020]" />
                    <span>{t.demo.message}</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t.demo.messagePlaceholder}
                    className="bg-[#111111] border border-white/15 px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FF2020] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="chamfer-btn w-full py-4 bg-[#FF0000] hover:bg-[#FF2020] text-white font-display font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2.5 red-glow-shadow cursor-pointer"
                >
                  <Send size={16} />
                  <span>{t.demo.button}</span>
                </button>

                {transmittedUrl && (
                  <div className="text-xs font-mono text-neutral-300 border border-[#FF0000]/30 bg-[#111111] p-3 flex items-center justify-between gap-4">
                    <span>{t.demo.readyText}</span>
                    <a
                      href={transmittedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF2020] hover:underline flex items-center gap-1 whitespace-nowrap"
                    >
                      <span>{t.demo.openLink}</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                )}
              </form>
            </div>
          </TechWindow>

          {/* Right: Direct Futuristic Communication Panels */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            <TechWindow delay={0.08}>
              <div className="bg-[#050505]/95 border border-white/12 p-6 chamfer-panel">
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF2020] mb-2">
                  {t.demo.directChannels}
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {t.footer.tagline} · {t.footer.location}
                </p>
              </div>
            </TechWindow>

            <TechWindow delay={0.12} className="flex-1">
              <a
                href="https://wa.me/212774677692"
                target="_blank"
                rel="noopener noreferrer"
                className="group h-full bg-[#050505]/95 border border-white/12 hover:border-[#FF2020] p-7 chamfer-panel transition-all hover:red-glow-shadow flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-[#111111] border border-[#FF0000]/35 text-[#FF2020] group-hover:bg-[#8B0000]/30 transition-colors">
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      {t.buttons.whatsapp}
                    </div>
                    <div className="text-lg sm:text-xl font-display font-bold text-white tabular-nums">
                      +212 774-677692
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={20} className="text-neutral-500 group-hover:text-[#FF2020] transition-colors shrink-0" />
              </a>
            </TechWindow>

            <TechWindow delay={0.16} className="flex-1">
              <a
                href="mailto:samiarafati3@gmail.com"
                className="group h-full bg-[#050505]/95 border border-white/12 hover:border-[#FF2020] p-7 chamfer-panel transition-all hover:red-glow-shadow flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-3.5 bg-[#111111] border border-[#FF0000]/35 text-[#FF2020] group-hover:bg-[#8B0000]/30 transition-colors shrink-0">
                    <Mail size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      {t.buttons.email}
                    </div>
                    <div className="text-base sm:text-lg font-display font-bold text-white truncate">
                      samiarafati3@gmail.com
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={20} className="text-neutral-500 group-hover:text-[#FF2020] transition-colors shrink-0" />
              </a>
            </TechWindow>
          </div>
        </div>
      </div>
    </section>
  );
};
