import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Linkedin, ShieldCheck, CreditCard, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- HELPER COMPONENTS (ICONS) ---

const LinkedInIcon = () => (
    <LinkedIn className="h-5 w-5 text-white" />
);

const LinkedIn = (props: any) => (
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
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


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
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-brand-400/70 focus-within:bg-brand-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-4 rounded-[1.5rem] bg-white/5 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-5 shadow-2xl hover:bg-white/10 transition-colors`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-xl shrink-0" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-bold text-white tracking-tight">{testimonial.name}</p>
      <p className="mt-2 text-white/80 font-medium leading-relaxed italic">"{testimonial.text}"</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Bienvenido</span>,
  description = "Accede a tu cuenta y continúa tu viaje con nosotros",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onLinkedInSignIn,
  onResetPassword,
  onCreateAccount,
  isLoginMode = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-sans w-[100dvw] overflow-hidden bg-white">
      {/* Back to Home Button */}
      <div className="absolute top-8 left-8 z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2.5 text-slate-400 hover:text-brand-600 transition-all text-[11px] font-black uppercase tracking-widest group bg-white/80 backdrop-blur-md px-5 py-3 rounded-full border border-slate-100 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Regresar al Inicio
        </Link>
      </div>

      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto bg-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
               <h1 className="animate-element animate-delay-100 text-4xl lg:text-5xl font-bold leading-tight tracking-tightest text-slate-900">{title}</h1>
               <p className="animate-element animate-delay-200 text-slate-500 font-medium text-lg lg:pr-12">{description}</p>
            </div>

            <form className="space-y-6" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Correo Electrónico</label>
                <GlassInputWrapper>
                  <input name="email" type="email" required placeholder="tu@email.com" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none font-medium text-slate-900" />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400 space-y-2">
                <div className="flex items-center justify-between mb-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Contraseña</label>
                   {isLoginMode && (
                     <button type="button" onClick={onResetPassword} className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-700 transition-colors">¿Olvidaste tu contraseña?</button>
                   )}
                </div>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} required placeholder="********" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none font-medium text-slate-900" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                      {showPassword ? <EyeOff className="w-5 h-5 hover:text-brand-600 transition-colors" /> : <Eye className="w-5 h-5 hover:text-brand-600 transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" name="rememberMe" className="w-5 h-5 rounded-lg border-slate-200 text-brand-600 focus:ring-brand-500/20 transition-all" />
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] group-hover:text-slate-600 transition-colors">Mantener sesión</span>
                </label>
              </div>

              <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-[#020617] py-4.5 font-black uppercase tracking-widest text-[11px] text-white hover:bg-slate-800 transition-all active:scale-[0.98] shadow-2xl shadow-slate-900/20">
                {isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center my-2">
              <span className="w-full border-t border-slate-100"></span>
              <span className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-300 bg-white absolute">O continúa con</span>
            </div>

            <button type="button" onClick={onLinkedInSignIn} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 bg-[#0077b5] hover:bg-[#006097] text-white rounded-2xl py-4.5 transition-all font-black text-[11px] uppercase tracking-widest active:scale-[0.98] shadow-lg shadow-brand-500/10">
                <LinkedInIcon />
                Continuar con LinkedIn
            </button>

            <p className="animate-element animate-delay-900 text-center text-sm text-slate-500 font-medium mt-4">
              {isLoginMode ? "¿Eres nuevo?" : "¿Ya tienes cuenta?"} <button type="button" onClick={onCreateAccount} className="text-brand-600 font-black uppercase tracking-widest text-[11px] hover:underline transition-colors ml-1">
                {isLoginMode ? 'Regístrate Gratis' : 'Inicia Sesión'}
              </button>
            </p>

            {/* Trust Badges Section */}
            <div className="animate-element animate-delay-1000 mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">100% Seguro</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sin Tarjeta</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">+2k Usuarios</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right column: 3 columns of testimonials with vertical offset (Masonry feel) */}
      {heroImageSrc && (
        <section className="hidden md:flex flex-1 relative bg-slate-950 items-center justify-center overflow-hidden">
          {/* Background Image with optimized overlay */}
          <div className="animate-slide-right animate-delay-300 absolute inset-0 bg-cover bg-center transition-transform duration-1000" style={{ backgroundImage: `url(${heroImageSrc})` }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-950/40 to-transparent backdrop-blur-[2px]" />
          </div>
          
          {testimonials.length > 0 && (
            <div className="relative z-10 w-full max-w-4xl p-12 h-full flex items-center justify-center">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {/* Column 1 */}
                <div className="flex flex-col gap-6 mt-12">
                   {testimonials.slice(0, 3).map((t, i) => (
                    <TestimonialCard key={i} testimonial={t} delay={`animate-delay-${1000 + i * 150}`} />
                   ))}
                </div>
                {/* Column 2 */}
                <div className="flex flex-col gap-6 -mt-12">
                   {testimonials.slice(3, 6).map((t, i) => (
                    <TestimonialCard key={i} testimonial={t} delay={`animate-delay-${1200 + i * 150}`} />
                   ))}
                </div>
                {/* Column 3 (Hidden on smaller desktops) */}
                <div className="hidden lg:flex flex-col gap-6 mt-6">
                   {testimonials.slice(6, 9).map((t, i) => (
                    <TestimonialCard key={i} testimonial={t} delay={`animate-delay-${1400 + i * 150}`} />
                   ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
