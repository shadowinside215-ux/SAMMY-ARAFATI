import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, ShieldCheck, Send } from 'lucide-react';

interface Service {
  title: string;
  price: string;
  priceType: string;
  setupPrice?: string;
  monthlyPrice?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, service }) => {
  const [copied, setCopied] = React.useState(false);
  const rib = "230 780 0000000000000000 00";

  const handleCopyRib = () => {
    navigator.clipboard.writeText(rib);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppConfirm = () => {
    if (!service) return;
    const priceText = service.priceType === 'starting-monthly' 
      ? `Setup: ${service.setupPrice}, Monthly: ${service.monthlyPrice}` 
      : service.price;
    const text = `Hello Sami, I would like to pay for the service: *${service.title}* (${priceText}). I have completed the transfer via CIH Bank RIB. Here is my confirmation.`;
    window.open(`https://wa.me/212774677692?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen || !service) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#B30000]/10 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B30000]/20 text-[#B30000] flex items-center justify-center font-bold">
                CIH
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">CIH Bank Payment (RIB)</h3>
                <p className="text-xs text-white/50">Sami's Digital Solutions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Selected Service & Exact Price */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs text-[#B30000] uppercase tracking-wider font-semibold">Selected Service & Exact Price</span>
              <div className="flex justify-between items-baseline mt-1">
                <h4 className="text-base font-bold text-white">{service.title}</h4>
                <span className="text-xl font-extrabold text-[#B30000]">
                  {service.priceType === 'starting-monthly' 
                    ? `${service.setupPrice} + ${service.monthlyPrice}/mo` 
                    : service.price}
                </span>
              </div>
            </div>

            {/* CIH RIB Details */}
            <div className="space-y-3">
              <div className="text-xs text-white/70 font-medium">Bank Account Details (CIH Bank):</div>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Account Holder:</span>
                  <span className="font-semibold text-white">Sami Arafati</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Bank:</span>
                  <span className="font-semibold text-white">CIH Bank Morocco</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-white/40 block">RIB Number</span>
                    <span className="font-mono text-sm text-white font-bold tracking-wider">{rib}</span>
                  </div>
                  <button
                    onClick={handleCopyRib}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-white/60 leading-relaxed bg-[#B30000]/5 border border-[#B30000]/20 rounded-xl p-4 flex gap-3 items-start">
              <ShieldCheck size={18} className="text-[#B30000] shrink-0 mt-0.5" />
              <p>
                Open your CIH Mobile app, transfer the exact amount shown above to the RIB provided, and click below to confirm your payment with Sami via WhatsApp.
              </p>
            </div>

            {/* Action */}
            <button
              onClick={handleWhatsAppConfirm}
              className="w-full py-4 bg-[#B30000] hover:bg-[#c80000] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(179,0,0,0.4)] cursor-pointer"
            >
              <Send size={18} />
              <span>Confirm Payment via WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
