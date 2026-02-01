import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Zap, Rocket, Timer, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { translations } from "@/translations";
import { useNavigate } from "react-router-dom";

interface OfferClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export const OfferClaimModal: React.FC<OfferClaimModalProps> = ({ isOpen, onClose, language }) => {
  const [step, setStep] = useState<'EXPLAIN' | 'REVEAL'>('EXPLAIN');
  const [copied, setCopied] = useState(false);
  const t = translations[language as keyof typeof translations].exclusiveOffer;
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(t.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    onClose();
    navigate('/login?coupon=' + t.couponCode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        // Reset step after modal closes
        setTimeout(() => setStep('EXPLAIN'), 300);
      }
    }}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl bg-white rounded-[2rem]">
        <div className="relative">
          {/* Header Accent */}
          <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 w-full" />
          
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 'EXPLAIN' ? (
                <motion.div
                  key="explain"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                      <Rocket size={32} />
                    </div>
                  </div>

                  <div className="space-y-2 text-center">
                    <DialogTitle className="text-2xl font-black text-slate-900 leading-tight">
                      {t.modalTitle}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 text-sm leading-relaxed px-4">
                      {t.modalSubtitle}
                    </DialogDescription>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white shrink-0">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none mb-1">Oferta Especial</p>
                      <p className="text-sm font-black text-slate-900 tracking-tight">{t.offerDetail}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      {t.confirmationTitle}
                    </p>
                    <Button 
                      onClick={() => setStep('REVEAL')}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-sm font-bold shadow-lg shadow-amber-600/20 gap-2 rounded-xl"
                    >
                      {t.confirmationButton}
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <motion.div 
                          className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="relative w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm">
                          <ShieldCheck size={32} />
                        </div>
                      </div>
                    </div>
                    <DialogTitle className="text-2xl font-black text-slate-900">
                      {t.couponTitle}
                    </DialogTitle>
                    <p className="text-slate-500 text-sm px-6">
                      {t.couponSubtitle}
                    </p>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
                    <div className="relative bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-800">
                      <span className="text-amber-400 text-3xl font-black tracking-tight mb-2 drop-shadow-sm">
                        {t.couponCode}
                      </span>
                      <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                        <Timer size={12} className="text-amber-500/50" />
                        {t.expiryWarning}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className={`h-12 border-2 gap-2 font-bold transition-all rounded-xl ${
                        copied 
                        ? 'border-green-500 text-green-600 bg-green-50' 
                        : 'border-slate-100 text-slate-700 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/50'
                      }`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? t.copiedFeedback : t.copyButton}
                    </Button>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        {t.redemptionSteps.title}
                      </p>
                      <ul className="space-y-2">
                        <li className="text-[11px] font-bold text-slate-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                          {t.redemptionSteps.step1}
                        </li>
                        <li className="text-[11px] font-bold text-slate-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                          {t.redemptionSteps.step2}
                        </li>
                        <li className="text-[11px] font-bold text-slate-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                          {t.redemptionSteps.step3}
                        </li>
                        <li className="text-[11px] font-bold text-slate-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                          {t.redemptionSteps.step4}
                        </li>
                        <li className="text-[11px] font-bold text-green-600 flex items-start gap-2">
                          <Check size={12} className="shrink-0 mt-0.5" />
                          {t.redemptionSteps.step5}
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleContinue}
                      className="h-12 bg-slate-900 text-white font-bold gap-2 rounded-xl hover:bg-slate-800"
                    >
                      {t.continueButton}
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
