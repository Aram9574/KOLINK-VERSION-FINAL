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

interface PricingProps {
  onPlanSelect?: (planId: string) => void;
  currentPlanId?: string;
  isUpgradeView?: boolean;
}

import { useState } from 'react';
// ... other imports

export function Pricing({ onPlanSelect, currentPlanId, isUpgradeView = false }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
              {isUpgradeView ? "Mejora tu Plan" : "Elige el plan perfecto para tu crecimiento"}
            </h2>
            {!isUpgradeView && (
              <p className="text-lg leading-relaxed tracking-tight text-slate-500 max-w-xl text-center font-medium">
                Desbloquea todo el potencial de tu marca personal en LinkedIn con IA avanzada.
              </p>
            )}
          </div>

          {/* Billing Toggle */}
          <div className="mt-6 flex items-center justify-center gap-4">
              <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Mensual</span>
              <button 
                  onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                  className="w-14 h-7 bg-brand-600 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${billingCycle === 'yearly' ? 'left-8' : 'left-1'}`} />
              </button>
              <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>Anual</span>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200">
                      Ahorra 20%
                  </span>
              </div>
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
                  <Button 
                    variant="outline" 
                    className="gap-4 w-full"
                    onClick={() => handleSelect('free')}
                    disabled={currentPlanId === 'free'}
                  >
                    {currentPlanId === 'free' ? "Tu Plan Actual" : "Comenzar Gratis"} 
                    {currentPlanId !== 'free' && <MoveRight className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PRO PLAN (Creator) */}
            <Card className="w-full rounded-2xl border-brand-200 shadow-2xl relative overflow-hidden bg-white hover:scale-105 transition-transform duration-300">
               <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">
                  POPULAR
               </div>
               <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent pointer-events-none z-0" />
              <CardHeader className="relative z-10">
                <CardTitle>
                  <span className="flex flex-row gap-2 items-center font-bold text-2xl text-brand-700">
                    <Zap className="w-6 h-6 fill-brand-100 text-brand-600" />
                    Pro / Creator
                  </span>
                </CardTitle>
                <CardDescription className="text-brand-900/60 font-medium">
                  Domina tu nicho con una IA que escribe exactamente como tú.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col gap-8 justify-start">
                  <div className="flex flex-col">
                      <p className="flex flex-row items-baseline gap-2 text-xl">
                        <span className="text-4xl font-bold text-slate-900">€{prices.pro[billingCycle]}</span>
                        <span className="text-sm text-slate-400 font-medium">
                          / mes
                        </span>
                      </p>
                      {billingCycle === 'yearly' && (
                          <p className="text-xs text-brand-600 font-bold mt-1">
                              Facturado €{prices.pro.yearly * 12}/año (Ahorras €36)
                          </p>
                      )}
                  </div>
                  <div className="flex flex-col gap-4 justify-start">
                    {/* ... features ... */}
                    <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-brand-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-900 font-bold">100 Posts / Mes</p>
                        <p className="text-slate-500 text-sm">
                          Umbral extendido para constancia total.
                        </p>
                      </div>
                    </div>
                     <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-brand-600 flex-shrink-0" />
                      <div className="flex flex-col">
                         <p className="text-slate-900 font-bold">Voice Lab (Desbloqueado)</p>
                        <p className="text-slate-500 text-sm">
                          Clonación de ADN de marca.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-brand-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-900 font-bold">Auditoría Viral</p>
                        <p className="text-slate-500 text-sm">
                          Puntuación de ganchos en tiempo real.
                        </p>
                      </div>
                    </div>
                     <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-brand-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-900 font-bold">Carousel Studio</p>
                        <p className="text-slate-500 text-sm">
                          Crea carruseles PDF en segundos.
                        </p>
                      </div>
                    </div>
                     <div className="flex flex-row gap-4">
                      <Check className="w-5 h-5 mt-0.5 text-brand-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <p className="text-slate-900 font-bold">Nexus Chat 24/7</p>
                        <p className="text-slate-500 text-sm">
                          Tu consultor estratégico personal.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="gap-4 w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                    onClick={() => handleSelect('pro')}
                    disabled={currentPlanId === 'pro'}
                  >
                    {isUpgradeView ? (currentPlanId === 'pro' ? "Plan Actual" : "Mejorar a Pro") : "Obtener Pro"} <MoveRight className="w-4 h-4" />
                  </Button>
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
                  <Button 
                    variant="outline" 
                    className="gap-4 w-full hover:border-indigo-500 hover:text-indigo-600"
                    onClick={() => handleSelect('viral')}
                    disabled={currentPlanId === 'viral'}
                  >
                     {currentPlanId === 'viral' ? "Plan Actual" : "Obtener Viral"} <MoveRight className="w-4 h-4" />
                  </Button>
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
