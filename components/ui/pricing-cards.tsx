import { Check, MoveRight, PhoneCall, Zap, Star, Shield, Gem } from "lucide-react";
import { Badge } from "./badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { useUser } from "../../context/UserContext";
import { translations } from "../../translations";

interface PricingProps {
  onPlanSelect?: (planId: string) => void;
  currentPlanId?: string;
  isUpgradeView?: boolean;
}

import { useState } from 'react';
import { motion } from 'framer-motion';

export function Pricing({ onPlanSelect, currentPlanId, isUpgradeView = false }: PricingProps) {
  const { language } = useUser();
  const t = translations[language].app.upgrade;
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleSelect = (plan: string) => {
    // ... existing logic
    const planParam = billingCycle === 'yearly' ? `${plan}_yearly` : plan;
    if (onPlanSelect) {
      onPlanSelect(planParam);
    } else {
        window.location.href = '/login?plan=' + planParam;
    }
  };

  const prices = {
      free: { monthly: 0, yearly: 0 },
      pro: { monthly: 15, yearly: 12 }, // 20% off approx
      viral: { monthly: 49, yearly: 39 }, // 20% off approx
  };

  return (
    <div className={`w-full ${isUpgradeView ? 'py-8' : 'py-20 lg:py-40'}`}>
      <div className="container mx-auto">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          {!isUpgradeView && <Badge variant="brand" className="px-4 py-1.5 text-sm">Pricing</Badge>}
          <div className="flex gap-2 flex-col">
            <h2 className={`tracking-tighter max-w-xl text-center font-bold text-slate-900 font-display ${isUpgradeView ? 'text-2xl' : 'text-3xl md:text-5xl'}`}>
              {isUpgradeView ? t.title : "Elige el plan perfecto para tu crecimiento"}
            </h2>
            {!isUpgradeView && (
              <p className="text-lg leading-relaxed tracking-tight text-slate-500 max-w-xl text-center font-medium">
                {t.subtitle}
              </p>
            )}
          </div>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4 bg-slate-50 p-1.5 rounded-full border border-slate-200 shadow-inner">
              <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                  {t.monthly}
              </button>
              <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                  {t.yearly}
                  <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-wide animate-pulse">
                      {t.save} / {t.yearly}
                  </span>
              </button>
          </div>


          <div className={`grid text-left grid-cols-1 lg:grid-cols-3 w-full gap-8 px-4 ${isUpgradeView ? 'pt-8' : 'pt-12'}`}>
            
            {/* STARTER PLAN (Free) */}
            <Card className="w-full rounded-2xl border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow-md bg-white">
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-row gap-4 items-center font-bold text-2xl text-slate-900">
                    Starter / Explorer
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Experimenta el poder de la IA viral sin compromiso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-8 justify-start">
                  <p className="flex flex-row items-baseline gap-2 text-xl">
                    <span className="text-4xl font-bold text-slate-900">€0</span>
                    <span className="text-sm text-slate-400 font-medium">
                      / Gratis
                    </span>
                  </p>
                  <div className="flex flex-col gap-4 justify-start">
                    {/* ... features ... */}
                    {/* Keep existing features for Starter */}
                    <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-brand-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-700 font-bold">10 Créditos de Prueba</p>
                        <p className="text-slate-500 text-sm">
                          Suficientes para validar la calidad.
                        </p>
                      </div>
                    </div>
                    {/* ... more features ... */}
                    <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-brand-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-700 font-bold">Generador de Posts</p>
                        <p className="text-slate-500 text-sm">
                          Frameworks virales (AIDA, PAS).
                        </p>
                      </div>
                    </div>
                     <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-brand-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-700 font-bold">Vista Previa LinkedIn</p>
                        <p className="text-slate-500 text-sm">
                          Mira cómo se verá antes de publicar.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-100">
                         <div className="flex flex-row gap-3 items-start opacity-60">
                            <LockIcon className="w-4 h-4 mt-1 text-slate-400 flex-shrink-0" />
                            <p className="text-slate-500 text-sm">Solo módulo de generación.</p>
                         </div>
                         <div className="flex flex-row gap-3 items-start opacity-60">
                            <LockIcon className="w-4 h-4 mt-1 text-slate-400 flex-shrink-0" />
                            <p className="text-slate-500 text-sm">Sin auditoría ni voz personalizada.</p>
                         </div>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="gap-4 w-full h-11 rounded-xl border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-colors bg-white font-bold flex items-center justify-center text-sm"
                    onClick={() => handleSelect('free')}
                    disabled={currentPlanId === 'free'}
                  >
                    {currentPlanId === 'free' ? t.currentPlan : t.upgradeNow} 
                    {currentPlanId !== 'free' && <MoveRight className="w-4 h-4" />}
                  </motion.button>
                </div>
              </CardContent>
            </Card>

            {/* PRO PLAN (Creator) */}
            <Card className="w-full relative overflow-hidden bg-white shadow-2xl hover:shadow-brand-500/20 transition-all duration-300 transform lg:-translate-y-4 lg:scale-105 border-2 border-brand-500 z-10 rounded-2xl">
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
               <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-bl-xl z-20 shadow-lg uppercase">
                  {t.mostPopular}
               </div>
               {/* Ambient Glow */}
               <div className="absolute inset-0 bg-gradient-to-b from-brand-50/80 to-transparent pointer-events-none z-0" />
               
              <CardHeader className="relative z-10 pb-0">
                <CardTitle>
                  <span className="flex flex-row gap-3 items-center font-bold text-2xl text-brand-700">
                    <div className="p-2 bg-brand-100/50 rounded-lg">
                        <Zap className="w-6 h-6 fill-brand-500 text-brand-600" />
                    </div>
                    Pro / Creator
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium mt-2">
                  Domina tu nicho con la suite completa de IA.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pt-6">
                <div className="flex flex-col gap-8 justify-start">
                  <div className="flex flex-col">
                      <p className="flex flex-row items-baseline gap-2 text-xl">
                        <span className="text-5xl font-bold text-slate-900 tracking-tight">€{prices.pro[billingCycle]}</span>
                        <span className="text-slate-400 font-medium">/ {language === 'es' ? 'mes' : 'month'}</span>
                      </p>
                      {billingCycle === 'yearly' && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit capitalize">
                              <Shield size={10} />
                              {t.saveAmount.replace("{{amount}}", "€36")}
                          </div>
                      )}
                  </div>
                  
                  <div className="h-px w-full bg-brand-100/50" />

                  <div className="flex flex-col gap-4 justify-start">
                    {/* Features */}
                    <div className="flex flex-row gap-4">
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-brand-700" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-slate-900 font-bold text-sm">100 Posts / Mes</p>
                        <p className="text-slate-500 text-xs">Suficiente para publicar 3x al día.</p>
                      </div>
                    </div>

                     <div className="flex flex-row gap-4">
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-brand-700" />
                      </div>
                      <div className="flex flex-col">
                         <p className="text-slate-900 font-bold text-sm">Voice Lab (Clone de Voz)</p>
                        <p className="text-slate-500 text-xs">Tu estilo, replicado perfectamente.</p>
                      </div>
                    </div>

                    <div className="flex flex-row gap-4">
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-brand-700" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-slate-900 font-bold text-sm">Auditoría Viral</p>
                        <p className="text-slate-500 text-xs">Puntuación de ganchos en tiempo real.</p>
                      </div>
                    </div>
                    
                     <div className="flex flex-row gap-4">
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-brand-700" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-slate-900 font-bold text-sm">Carousel Studio</p>
                        <p className="text-slate-500 text-xs">Exporta PDFs virales al instante.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-[1px] rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-[11px] flex items-center gap-3">
                        <div className="p-1.5 bg-brand-100 rounded-lg text-brand-600">
                             <Gem size={16} />
                        </div>
                        <div>
                             <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Incluye Nexus Chat</p>
                             <p className="text-[10px] text-slate-500 font-medium">Tu consultor estratégico de IA 24/7</p>
                        </div>
                      </div>
                  </div>

                  <motion.button 
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/30 h-12 text-base rounded-xl font-bold flex items-center justify-center transition-all"
                    onClick={() => handleSelect('pro')}
                    disabled={currentPlanId === 'pro'}
                  >
                    {isUpgradeView ? (currentPlanId === 'pro' ? t.currentPlan : t.upgradeNow) : t.upgradeNow} 
                    <MoveRight className="w-4 h-4" />
                  </motion.button>
                  
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-[-10px]">
                      {t.moneyBack}
                  </p>
                  
                  <div className="mt-2 pt-4 border-t border-brand-100 flex items-center justify-center gap-3">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-700 border border-white z-20">AJ</div>
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-700 border border-white z-10">MR</div>
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-700 border border-white z-0">KS</div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.socialProof}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VIRAL PLAN (Authority) */}
            <Card className="w-full rounded-2xl border-slate-200 hover:border-indigo-200 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 bg-white">
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-row gap-4 items-center font-bold text-2xl text-slate-900">
                    Viral / Authority
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Escala tu autoridad en piloto automático con inteligencia predictiva.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-8 justify-start">
                  <div className="flex flex-col">
                      <p className="flex flex-row items-baseline gap-2 text-xl">
                        <span className="text-4xl font-bold text-slate-900">€{prices.viral[billingCycle]}</span>
                        <span className="text-sm text-slate-400 font-medium">
                          / mes
                        </span>
                      </p>
                      {billingCycle === 'yearly' && (
                          <p className="text-xs text-indigo-600 font-bold mt-1">
                              Facturado €{prices.viral.yearly * 12}/año (Ahorras €120)
                          </p>
                      )}
                  </div>
                  <div className="flex flex-col gap-4 justify-start">
                    {/* ... features ... */}
                    <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-indigo-500 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-700 font-bold">Créditos Ilimitados / VIP</p>
                        <p className="text-slate-400 text-sm">
                          Sin límites de volumen.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-indigo-500 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-700 font-bold">Smart Autopilot Engine</p>
                        <p className="text-slate-400 text-sm">
                          Programación y automatización total.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-indigo-500 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-700 font-bold">Insight Responder</p>
                        <p className="text-slate-400 text-sm">
                          Respuestas inteligentes para hackear el algoritmo.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-indigo-500 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-700 font-bold">Soporte Prioritario</p>
                        <p className="text-slate-400 text-sm">
                          Acceso directo a desarrollo y funciones beta.
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="gap-4 w-full h-11 rounded-xl border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-colors bg-white font-bold flex items-center justify-center text-sm"
                    onClick={() => handleSelect('viral')}
                    disabled={currentPlanId === 'viral'}
                  >
                     {currentPlanId === 'viral' ? t.currentPlan : t.upgradeNow} <MoveRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </CardContent>
            </Card>



          </div>
        </div>
      </div>
    </div>
  );
}

function LockIcon({ className }: { className: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
}
