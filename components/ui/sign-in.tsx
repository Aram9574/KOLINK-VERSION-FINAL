import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, Zap, Layout, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPE DEFINITIONS ---
export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onLinkedInSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
  isLoginMode?: boolean;
  // Dynamic Text Props
  emailLabel?: string;
  passwordLabel?: string;
  forgotPasswordLabel?: string;
  rememberMeLabel?: string;
  loginButtonLabel?: string;
  signupButtonLabel?: string;
  orContinueLabel?: string;
  linkedinButtonLabel?: string;
  newHereLabel?: string;
  alreadyMemberLabel?: string;
  registerLinkText?: string;
  loginLinkText?: string;
  legalConsentLabel?: React.ReactNode;
  trustBadges?: {
    security: string;
    noCard: string;
    users: string;
  };
}

// --- SUB-COMPONENTS ---

const AuthInput = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  required,
  showToggle,
  onToggle
}: { 
  label: string; 
  name: string; 
  type?: string; 
  placeholder?: string; 
  required?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
}) => (
  <div className="space-y-1.5 group">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-brand-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white text-slate-900 text-[14px] font-medium px-4 py-3.5 rounded-xl border border-slate-200 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-slate-300"
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-brand-600 transition-colors"
        >
          {type === 'password' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )}
    </div>
  </div>
);


// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps & { language?: string }> = ({
  title = "Bienvenido de nuevo",
  description = "Ingresa a tu panel de control.",
  onSignIn,
  onLinkedInSignIn,
  onResetPassword,
  onCreateAccount,
  isLoginMode = true,
  emailLabel = "Correo Electrónico",
  passwordLabel = "Contraseña",
  forgotPasswordLabel = "¿Olvidaste tu contraseña?",
  rememberMeLabel = "Recordar dispositivo",
  loginButtonLabel = "Iniciar Sesión",
  signupButtonLabel = "Crear Cuenta",
  orContinueLabel = "O continúa con",
  linkedinButtonLabel = "LinkedIn",
  newHereLabel = "¿No tienes cuenta?",
  alreadyMemberLabel = "¿Ya tienes cuenta?",
  registerLinkText = "Regístrate",
  loginLinkText = "Inicia sesión",
  legalConsentLabel,
  language = 'en'
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      {/* 
        --------------------
        LEFT COLUMN (FORM) 
        --------------------
      */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-[45%] xl:w-[40%] flex flex-col relative bg-white"
      >
        {/* Header / Logo Area */}
        <div className="absolute top-8 left-8 py-2">
           <Link to="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm shadow-brand-500/20 shadow-lg">K</div>
             <span className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-brand-600 transition-colors">Kolink</span>
           </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-16 xl:px-24 max-w-[640px] mx-auto w-full">
            <div className="mb-10 space-y-2">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900"
                >
                  {title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-slate-500 text-[15px] font-medium"
                >
                  {description}
                </motion.p>
            </div>

            <form onSubmit={onSignIn} className="space-y-6">
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                >
                  <AuthInput 
                    label={emailLabel!} 
                    name="email" 
                    type="email" 
                    placeholder="tucorreo@empresa.com" 
                    required 
                  />
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                        {passwordLabel}
                      </label>
                      {isLoginMode && (
                        <button type="button" onClick={onResetPassword} className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                          {forgotPasswordLabel}
                        </button>
                      )}
                  </div>
                   <div className="relative group">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        className="w-full bg-white text-slate-900 text-[14px] font-medium px-4 py-3.5 rounded-xl border border-slate-200 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-brand-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 }}
                   className="flex flex-col gap-3"
                >
                   <div className="flex items-center">
                       <input type="checkbox" id="remember" name="rememberMe" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                       <label htmlFor="remember" className="ml-2 text-sm font-medium text-slate-600 cursor-pointer select-none">
                         {rememberMeLabel}
                       </label>
                   </div>

                   {!isLoginMode && legalConsentLabel && (
                       <div className="flex items-start gap-2">
                            <input 
                               type="checkbox" 
                               id="legalConsent" 
                               name="legalConsent" 
                               required 
                               className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" 
                           />
                            <label htmlFor="legalConsent" className="text-xs font-medium text-slate-500 leading-relaxed cursor-pointer select-none">
                               {legalConsentLabel}
                            </label>
                       </div>
                   )}
                </motion.div>

                <motion.button 
                   whileHover={{ scale: 1.01 }}
                   whileTap={{ scale: 0.99 }}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6 }}
                   type="submit" 
                   className="w-full bg-slate-900 text-white font-bold text-[14px] py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                >
                   {isLoginMode ? loginButtonLabel : signupButtonLabel}
                   <ArrowRight className="w-4 h-4 text-slate-400" />
                </motion.button>
            </form>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.7 }}
               className="relative my-8"
            >
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">{orContinueLabel}</span></div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8 }}
            >
                <button type="button" onClick={onLinkedInSignIn} className="w-full bg-[#0a66c2]/5 text-[#0a66c2] border border-[#0a66c2]/20 font-bold text-[14px] py-3.5 rounded-xl hover:bg-[#0a66c2]/10 transition-all flex items-center justify-center gap-2">
                   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 21.227.792 22 1.771 22h20.451C23.2 22 24 21.227 24 20.271V1.729C24 .774 23.2 0 22.224 0z"/></svg>
                   {linkedinButtonLabel}
                </button>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.9 }}
               className="mt-8 text-center"
            >
                <p className="text-slate-500 text-sm">
                   {isLoginMode ? newHereLabel : alreadyMemberLabel} 
                   <button type="button" onClick={onCreateAccount} className="ml-1.5 font-bold text-brand-600 hover:underline">
                      {isLoginMode ? registerLinkText : loginLinkText}
                   </button>
                </p>
            </motion.div>

             {/* Footer Links */}
              <div className="mt-12 flex items-center justify-center gap-6 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <Link to="/" className="hover:text-slate-600 transition-colors">{language === 'es' ? 'Inicio' : 'Start'}</Link>
                <Link to="/privacy" className="hover:text-slate-600 transition-colors">{language === 'es' ? 'Privacidad' : 'Privacy'}</Link>
                <Link to="/terms" className="hover:text-slate-600 transition-colors">{language === 'es' ? 'Términos' : 'Terms'}</Link>
                <Link to="/legal" className="hover:text-slate-600 transition-colors">{language === 'es' ? 'Aviso Legal' : 'Legal'}</Link>
              </div>
        </div>
      </motion.div>

       {/* 
        --------------------
        RIGHT COLUMN (BRAND) - LIGHT PREMIUM
        --------------------
      */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 1 }}
         className="hidden lg:flex flex-1 relative bg-slate-50 overflow-hidden items-center justify-center p-12"
      >
         {/* Dynamic Background - Light Mode */}
         <div className="absolute inset-0 bg-slate-50">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 mix-blend-multiply"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 mix-blend-multiply"></div>
         </div>

         {/* Content Showcase Card */}
         <div className="relative z-10 w-full max-w-xl">
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4, duration: 0.8 }}
               className="mb-10 text-center lg:text-left"
            >
                <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Tu ecosistema de <br/>
                  <span className="text-brand-600">Crecimiento Viral</span>.
                </h2>
                <p className="mt-4 text-slate-600 text-lg leading-relaxed max-w-md">
                  Una suite completa de herramientas IA diseñadas para automatizar tu éxito en LinkedIn.
                </p>
            </motion.div>

            {/* INTERACTIVE PRODUCT SHOWCASE 2.0 */}
            <div className="relative z-10 w-full perspective-[2000px] group">
                <InteractiveShowcase />
                
                {/* Floor Reflection/Shadow - Light Mode */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-brand-600/10 blur-[60px] rounded-full pointer-events-none"></div>
            </div>
         </div>
      </motion.div>
    </div>
  );
};

// --- INTERACTIVE SHOWCASE 2.0 (5 MODULES) ---

const InteractiveShowcase = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    const tabs = [
        {
            id: 'generator',
            icon: Zap,
            label: 'AI Writer',
            color: 'text-brand-600',
            bg: 'bg-brand-50'
        },
        {
            id: 'carousel',
            icon: Layout,
            label: 'Carousels',
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            id: 'scheduler',
            icon: Calendar,
            label: 'Scheduler',
            color: 'text-pink-600',
            bg: 'bg-pink-50'
        },
        {
            id: 'audit',
            icon: Eye,
            label: 'Auditor',
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            id: 'analytics',
            icon: BarChart3,
            label: 'Analytics',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        }
    ];

    // Auto-play logic
    React.useEffect(() => {
        let interval: any;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setActiveTab(current => (current + 1) % tabs.length);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 60); // Slower pacing: 60ms * 100 = 6000ms per slide
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, activeTab]);

    const handleTabClick = (index: number) => {
        setIsAutoPlaying(false);
        setActiveTab(index);
        setProgress(0);
    };

    return (
        <div className="flex gap-6 h-[460px]">
             {/* APP WINDOW (Left Side) */}
             <motion.div 
                className="flex-1 relative bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col transform-style-3d overflow-hidden"
                initial={{ rotateY: -2 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 1 }}
                whileHover={{ rotateY: 1, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
             > 
                {/* Fake Browser Header - Light */}
                <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2 shrink-0">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="ml-4 px-3 py-1 bg-white rounded-md border border-slate-200 text-[10px] text-slate-400 font-medium w-48 flex items-center justify-center shadow-sm">
                        app.kolink.ai/{tabs[activeTab].id}
                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 relative bg-slate-50/50 p-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 0 && <GeneratorDemo key="gen" />}
                        {activeTab === 1 && <CarouselDemo key="car" />}
                        {activeTab === 2 && <SchedulerDemo key="sch" />}
                        {activeTab === 3 && <AuditDemo key="aud" />}
                        {activeTab === 4 && <AnalyticsDemo key="ana" />}
                    </AnimatePresence>
                </div>

                {/* Footer Info */}
                <div className="h-14 bg-white border-t border-slate-100 flex items-center px-6 justify-between text-xs">
                    <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full animate-pulse ${tabs[activeTab].color.replace('text-', 'bg-')}`}></div>
                         <span className="font-bold text-slate-700">{tabs[activeTab].label} Mode</span>
                    </div>
                    <div className="text-slate-400 font-medium">v2.4.0</div>
                </div>
             </motion.div>

             {/* VERTICAL NAV (Right Side) */}
             <div className="w-16 flex flex-col items-center justify-center gap-4 py-2">
                 {tabs.map((tab, index) => (
                     <button 
                        key={tab.id}
                        onClick={() => handleTabClick(index)}
                        className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${activeTab === index ? 'bg-white text-slate-900 shadow-lg scale-110 border border-slate-100' : 'bg-transparent text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-md'}`}
                     >
                        {/* Progress Ring */}
                        {activeTab === index && isAutoPlaying && (
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none text-brand-600" viewBox="0 0 48 48">
                                <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="145" strokeDashoffset={145 - (145 * progress) / 100} className="transition-all duration-100 ease-linear opacity-20" />
                            </svg>
                        )}
                        
                        <tab.icon className={`w-5 h-5 ${activeTab === index ? tab.color : ''}`} />
                        
                        {/* Tooltip */}
                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none transform -translate-x-2 group-hover:translate-x-0 z-50 shadow-xl">
                            {tab.label}
                        </div>
                     </button>
                 ))}
             </div>
        </div>
    );
};

// --- 5 MINI-APP DEMOS (HIGH FIDELITY) ---

const GeneratorDemo = () => {
    const fullText = "3 Estrategias para escalar un SaaS B2B sin ads en 2025:\n\n1. Founder-Led Sales\n2. LinkedIn Inbound\n3. Cold Email Personalizado\n\n¿Cuál es tu favorita? 👇";
    const [typedText, setTypedText] = React.useState("");
    const [isGenerating, setIsGenerating] = React.useState(true);

    React.useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, i));
            i++;
            if (i > fullText.length + 50) {
                i = 0; // Loop
                setIsGenerating(true);
            } else if (i > fullText.length) {
                setIsGenerating(false);
            }
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col gap-3">
             {/* Fake Toolbar */}
             <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 shadow-sm">
                 <div className="flex items-center gap-2">
                     <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Viral Post
                     </div>
                     <div className="h-4 w-[1px] bg-slate-200"></div>
                     <div className="text-[10px] text-slate-400 font-medium">Tono: Profesional</div>
                 </div>
                 <div className="flex gap-1">
                     <div className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 transition-colors"></div>
                     <div className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 transition-colors"></div>
                 </div>
             </div>
             
             {/* Content Area */}
             <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative font-sans text-sm text-slate-700 leading-relaxed whitespace-pre-wrap overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500/0 via-brand-500/50 to-brand-500/0 opacity-0 animate-[shimmer_2s_infinite]"></div>
                 {typedText}
                 <span className="animate-pulse ml-0.5 inline-block w-1.5 h-4 bg-brand-500 align-middle"></span>
             </div>

             {/* Action Bar */}
             <div className="flex justify-end">
                 <button className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 hover:scale-105'}`}>
                     <Zap className="w-3 h-3" />
                     {isGenerating ? 'Generando...' : 'Regenerar'}
                 </button>
             </div>
        </motion.div>
    );
};

const CarouselDemo = () => {
    const [slide, setSlide] = useState(0);
    // Auto-cycle slides logic
    useEffect(() => {
        const interval = setInterval(() => setSlide(s => (s + 1) % 4), 1500);
        return () => clearInterval(interval);
    }, []);

    const slides = [
        { title: "Hook", bg: "bg-slate-900", text: "text-white" },
        { title: "Problema", bg: "bg-brand-600", text: "text-white" },
        { title: "Solución", bg: "bg-white", text: "text-slate-900", border: "border border-slate-200" },
        { title: "CTA", bg: "bg-slate-900", text: "text-white" }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
             {/* Mini Toolbar */}
             <div className="h-8 border-b border-slate-200 flex items-center justify-between px-2 mb-3">
                 <div className="flex gap-2">
                     <div className="w-4 h-4 rounded bg-slate-200"></div>
                     <div className="w-4 h-4 rounded bg-slate-200"></div>
                     <div className="w-4 h-4 rounded bg-brand-100"></div>
                 </div>
                 <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Editor Pro</div>
             </div>

             <div className="flex-1 flex gap-3 overflow-hidden">
                 {/* Sidebar Tools */}
                 <div className="w-8 flex flex-col gap-2 border-r border-slate-100 pr-2">
                     {[1,2,3,4].map(i => (
                         <div key={i} className="w-full aspect-square rounded bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"></div>
                     ))}
                 </div>

                 {/* Canvas */}
                 <div className="flex-1 bg-slate-100 rounded-lg flex items-center justify-center p-4 relative overflow-hidden group">
                     {/* The Slide */}
                     <AnimatePresence mode="wait">
                         <motion.div 
                            key={slide}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`w-32 aspect-[4/5] rounded shadow-xl ${slides[slide].bg} ${slides[slide].border || ''} flex flex-col items-center justify-center p-3 relative`}
                         >
                             <div className={`text-[8px] font-bold opacity-50 absolute top-2 left-2 ${slides[slide].text}`}>0{slide + 1}</div>
                             <div className={`font-bold text-center leading-tight ${slides[slide].text} ${slide === 2 ? 'text-xs' : 'text-sm'}`}>
                                 {slide === 0 && "Cómo escalar..."}
                                 {slide === 1 && "El error #1..."}
                                 {slide === 2 && "Usa IA..."}
                                 {slide === 3 && "Sígueme 🔔"}
                             </div>
                             <div className={`w-4 h-4 rounded-full absolute bottom-2 right-2 opacity-50 ${slides[slide].text === 'text-white' ? 'bg-white' : 'bg-slate-900'}`}></div>
                         </motion.div>
                     </AnimatePresence>

                     {/* Fake Cursor Interaction */}
                     <motion.div 
                        className="absolute w-3 h-3 border-2 border-white bg-black rounded-full shadow-lg z-20 pointer-events-none"
                        animate={{ x: [0, 50, -30, 0], y: [0, -30, 20, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{ top: '60%', left: '40%' }}
                     />
                 </div>
             </div>

             {/* Bottom Slide Strip */}
             <div className="h-10 mt-3 flex gap-2 overflow-hidden opacity-60">
                 {slides.map((s, i) => (
                     <div key={i} className={`flex-1 rounded-sm border ${i === slide ? 'border-brand-500 ring-1 ring-brand-200' : 'border-slate-200'} ${s.bg}`}></div>
                 ))}
             </div>
        </motion.div>
    );
};

const SchedulerDemo = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
                 <div className="text-xs font-bold text-slate-700">Mejor hora para publicar</div>
                 <div className="text-[10px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-bold">Martes, 10:00 AM</div>
            </div>
            
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col gap-1">
                {/* Header */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                        <div key={d} className="text-[8px] text-center text-slate-400 font-bold">{d}</div>
                    ))}
                </div>
                {/* Grid */}
                <div className="grid grid-cols-7 grid-rows-5 gap-1 flex-1">
                     {Array.from({ length: 35 }).map((_, i) => {
                        const intensity = [0, 1, 3, 2, 5, 8, 4, 2, 0, 6, 9, 10, 5, 2, 1, 3, 7, 4, 1, 0, 2, 8, 6, 3, 1, 0, 4, 2, 1, 0, 3, 5, 2, 1, 0][i];
                        const opacity = intensity / 10;
                        return (
                            <div key={i} className="relative group">
                                <div 
                                    className="w-full h-full rounded-[2px] transition-all hover:scale-125 hover:z-10 hover:shadow-lg"
                                    style={{ 
                                        backgroundColor: `rgba(79, 70, 229, ${opacity || 0.05})`, // Indigo-600 base
                                        border: opacity > 0.8 ? '1px solid rgba(255,255,255,0.5)' : 'none'
                                    }}
                                ></div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 pointer-events-none">
                                    {(opacity * 100).toFixed(0)}% Impacto
                                </div>
                            </div>
                        )
                     })}
                </div>
            </div>
        </motion.div>
    );
};

const AuditDemo = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center gap-4 relative">
             {/* Backdrop Grid */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)]"></div>

            <div className="relative z-10">
                {/* Central Score */}
                <div className="w-28 h-28 rounded-full bg-white border border-slate-100 shadow-2xl flex flex-col items-center justify-center relative">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">92</span>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Excelente</span>
                    
                    {/* Ring SVGs */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                         <circle cx="56" cy="56" r="52" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                         <circle cx="56" cy="56" r="52" fill="none" stroke="#4f46e5" strokeWidth="6" strokeDasharray="327" strokeDashoffset="30" strokeLinecap="round" className="animate-[dash_2s_ease-out]" />
                    </svg>
                </div>
            </div>
            
            <div className="w-full max-w-[200px] space-y-2">
                {['Bio', 'Experiencia', 'Foto'].map((label, i) => (
                    <div key={label} className="flex items-center justify-between text-slate-600 text-xs bg-white border border-slate-100 p-2 rounded-lg shadow-sm">
                        <span className="font-semibold">{label}</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className={`w-1.5 h-1.5 rounded-full ${star <= (i === 1 ? 4 : 5) ? 'bg-amber-400' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const AnalyticsDemo = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col gap-3">
             <div className="flex gap-2">
                 <div className="flex-1 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                     <div className="text-[9px] text-slate-400 font-bold uppercase">Impresiones</div>
                     <div className="text-lg font-black text-slate-900 mt-0.5">142.5k</div>
                 </div>
                 <div className="flex-1 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                     <div className="text-[9px] text-slate-400 font-bold uppercase">Seguidores</div>
                     <div className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-1">
                         2,450 <span className="text-[9px] text-green-500 bg-green-50 px-1 py-0.5 rounded-full">+120</span>
                     </div>
                 </div>
             </div>

             <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden flex items-end justify-between px-6 pb-2">
                 {/* Background Grid Lines */}
                 <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-50">
                     {[1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-slate-100 border-t border-dashed border-slate-200"></div>)}
                 </div>

                 {/* Animated Bars */}
                 {[30, 45, 35, 60, 50, 85, 65, 90, 75, 50].map((h, i) => (
                    <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05, ease: "backOut" }}
                        className="w-1.5 bg-brand-500 rounded-t-full relative group cursor-pointer"
                    >
                         <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/20 to-transparent h-full opacity-50"></div>
                         {/* Hover Tooltip */}
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             {h * 10}
                         </div>
                    </motion.div>
                ))}
             </div>
        </motion.div>
    );
};

