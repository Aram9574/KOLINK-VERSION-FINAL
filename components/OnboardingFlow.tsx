
import React, { useState } from 'react';
import { ArrowRight, User, Globe, Search, Youtube, MessageCircle, Users, Check, Briefcase, Building2, Rocket, Target, UserPlus, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingFlowProps {
  user: UserProfile;
  onComplete: (updatedUser: Partial<UserProfile>) => void;
}

const SOURCES = [
  { id: 'linkedin', label: 'LinkedIn', icon: <Globe className="w-5 h-5" /> },
  { id: 'twitter', label: 'Twitter / X', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'friend', label: 'Amigo / Colega', icon: <Users className="w-5 h-5" /> },
  { id: 'youtube', label: 'YouTube', icon: <Youtube className="w-5 h-5" /> },
  { id: 'google', label: 'Buscador', icon: <Search className="w-5 h-5" /> },
  { id: 'other', label: 'Otro', icon: <ArrowRight className="w-5 h-5" /> },
];

const USAGE_INTENTS = [
  { id: 'personal_brand', label: 'Marca Personal', description: 'Construir autoridad y red', icon: <User className="w-5 h-5" /> },
  { id: 'company', label: 'Página de Empresa', description: 'Promocionar mi startup', icon: <Building2 className="w-5 h-5" /> },
  { id: 'agency', label: 'Trabajo para Clientes', description: 'Ghostwriting para otros', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'sales', label: 'Ventas / Leads', description: 'Venta social', icon: <Target className="w-5 h-5" /> },
  { id: 'job_hunt', label: 'Búsqueda de Empleo', description: 'Ser visto por reclutadores', icon: <UserPlus className="w-5 h-5" /> },
  { id: 'content_creator', label: 'Creador de Contenido', description: 'Monetizar audiencia', icon: <Rocket className="w-5 h-5" /> },
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  
  // Step 1 Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState(''); // Maps to headline
  
  // Step 2 Data
  const [usageIntent, setUsageIntent] = useState<string[]>([]);
  
  // Step 3 Data
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!firstName || !lastName || !jobTitle) return;
      setStep(2);
    } else if (step === 2) {
      if (usageIntent.length === 0) return;
      setStep(3);
    } else {
      // Finish
      onComplete({
        name: `${firstName} ${lastName}`,
        headline: jobTitle, // Using job title as initial headline
        hasOnboarded: true
      });
    }
  };

  const toggleSource = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleUsage = (id: string) => {
    setUsageIntent(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-white/80 backdrop-blur-xl border border-white/50 w-full max-w-xl p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 my-auto">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= 1 ? 'bg-brand-600' : 'bg-slate-100'}`} />
          <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= 2 ? 'bg-brand-600' : 'bg-slate-100'}`} />
          <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= 3 ? 'bg-brand-600' : 'bg-slate-100'}`} />
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm">
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">¡Bienvenido a Kolink!</h2>
              <p className="text-slate-500">Personalicemos tu estudio. ¿Cómo te llamas?</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Nombre</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 font-medium"
                      placeholder="Juan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Apellido</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 font-medium"
                      placeholder="Pérez"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Profesión / Cargo</label>
                <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-slate-900 font-medium"
                      placeholder="ej. Fundador, Marketing Manager, Desarrollador"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleNextStep}
              disabled={!firstName || !lastName || !jobTitle}
              className="w-full mt-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:bg-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Siguiente Paso
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Usage Intent */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="text-center mb-8">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-sm">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">¿Cuál es tu objetivo?</h2>
              <p className="text-slate-500">Esto ayuda a nuestra IA a seleccionar los mejores marcos virales.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {USAGE_INTENTS.map((intent) => {
                const isSelected = usageIntent.includes(intent.id);
                return (
                  <button
                    key={intent.id}
                    onClick={() => toggleUsage(intent.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 relative group
                      ${isSelected 
                        ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                    <div className={`mb-2 ${isSelected ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {intent.icon}
                    </div>
                    <p className="text-sm font-bold mb-0.5">{intent.label}</p>
                    <p className="text-xs opacity-70 font-medium">{intent.description}</p>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleNextStep}
              disabled={usageIntent.length === 0}
              className="w-full mt-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:bg-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Siguiente Paso
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 3: Attribution */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="text-center mb-8">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm">
                <Globe className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Una última cosa...</h2>
              <p className="text-slate-500">¿Cómo te enteraste de Kolink?</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SOURCES.map((source) => {
                const isSelected = selectedSources.includes(source.id);
                return (
                  <button
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col items-center justify-center gap-2 relative
                      ${isSelected 
                        ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                    <div className={`${isSelected ? 'text-brand-600' : 'text-slate-400'}`}>
                      {source.icon}
                    </div>
                    <span className="text-sm font-bold">{source.label}</span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleNextStep}
              disabled={selectedSources.length === 0}
              className="w-full mt-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:bg-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Empezar a Crear
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                Usamos esta información para personalizar tus marcos virales.
            </p>
        </div>

      </div>
    </div>
  );
};

export default OnboardingFlow;
