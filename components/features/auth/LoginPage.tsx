import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { APP_DOMAIN } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { Helmet } from "react-helmet-async";
import { useUser } from "../../../context/UserContext";
import { SignInPage, Testimonial } from "../../ui/sign-in";
import { translations } from "../../../translations";

const sampleTestimonials: Testimonial[] = [
    // Row 1
    {
        avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
        name: "Sofía Martínez",
        handle: "",
        text: "¡Incrementalmente mejor que cualquier otra herramienta! Kolink ha transformado mi presencia en LinkedIn."
    },
    {
        avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
        name: "Alejandro Rodríguez",
        handle: "",
        text: "La IA de Kolink entiende mi voz perfectamente. Ahorro horas cada semana en creación de contenido."
    },
    {
        avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Diego Fernández",
        handle: "",
        text: "Si eres serio sobre LinkedIn, necesitas Kolink. Es como tener un ghostwriter profesional 24/7."
    },
    // Row 2
    {
        avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "Lucía Gómez",
        handle: "",
        text: "La mejor inversión para mi marca personal este año. El ROI en tiempo es incalculable."
    },
    {
        avatarSrc: "https://randomuser.me/api/portraits/men/22.jpg",
        name: "Carlos Ruiz",
        handle: "",
        text: "El autómata de carruseles es magia pura. Mis impresiones han subido un 300% en un mes."
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Elena Blanco",
      handle: "",
      text: "Interfaz limpia, potente y efectiva. Kolink es el estándar de oro para LinkedIn IA."
    },
    // Row 3
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/45.jpg",
      name: "Roberto Cruz",
      handle: "",
      text: "Nexus Chat es mi consultor de estrategia 24/7. Sus consejos son precisos y accionables."
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/women/12.jpg",
      name: "Valentina Rey",
      handle: "",
      text: "Poder clonar mi estilo de escritura es lo que más me gusta. Nadie nota que uso IA."
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/90.jpg",
      name: "Javier Sosa",
      handle: "",
      text: "Como desarrollador, valoro lo pulido que está el app. Es simplemente una herramienta superior."
    }
];

const LoginPage: React.FC = () => {
    const { language } = useUser();
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isResetMode, setIsResetMode] = useState(false); // New State for Reset Password
    const [isLoading, setIsLoading] = useState(false);

    // Translations
    const t = translations[language]?.auth || translations['en'].auth;

    // Reset loading state if session is established or component re-mounts
    useEffect(() => {
        // @ts-ignore
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event) => {
                if (event === "SIGNED_IN" || event === "USER_UPDATED") {
                    setIsLoading(false);
                }
            },
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        
        // Handle Password Reset
        if (isResetMode) {
            setIsLoading(true);
            try {
                // @ts-ignore
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/update-password`,
                });
                if (error) throw error;
                toast.success(t.reset?.success || "Link sent check email.", "Email Sent");
                setIsResetMode(false); // Go back to login
            } catch (error: any) {
                console.error("Reset Error:", error);
                toast.error(error.message || t.reset?.error || "Error", "Error");
            } finally {
                setIsLoading(false);
            }
            return;
        }

        const password = formData.get('password') as string;
        setIsLoading(true);

        try {
            if (isLoginMode) {
                // @ts-ignore
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                // @ts-ignore
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: localStorage.getItem("kolink_referral_code")
                            ? {
                                referred_by: localStorage.getItem(
                                    "kolink_referral_code",
                                ),
                            }
                            : undefined,
                    },
                });
                if (error) throw error;
                toast.success(
                    language === "es"
                        ? "Cuenta creada. Por favor verifica tu correo."
                        : "Account created. Please check your email.",
                    "Registro Exitoso"
                );
            }
        } catch (error: any) {
            console.error("Auth Error:", error);
            let msg = error.message || "Error de autenticación";
            if (msg.includes("Failed to fetch")) {
                msg = language === "es" 
                    ? "Error de conexión. Verifica tu internet." 
                    : "Connection error. Check your internet.";
            }
            toast.error(msg, "Error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async () => {
        setIsLoading(true);
        try {
            const redirectTo = `https://${APP_DOMAIN}/dashboard`;
            // @ts-ignore
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'linkedin_oidc',
                options: {
                    redirectTo,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error(error.message || `Error al iniciar sesión`, "Error");
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>
                    {isResetMode
                        ? (language === "es" ? "Recuperar Password - Kolink" : "Recover Password - Kolink") 
                        : isLoginMode
                            ? (language === "es" ? "Iniciar Sesión - Kolink" : "Login - Kolink")
                            : (language === "es" ? "Crear Cuenta - Kolink" : "Sign Up - Kolink")}
                </title>
                <meta name="description" content={language === "es" ? "Accede a tu cuenta de Kolink y gestiona tu crecimiento en LinkedIn con IA." : "Login to your Kolink account and manage your LinkedIn growth with AI."} />
            </Helmet>

            {isResetMode ? (
                 <div className="h-[100dvh] flex items-center justify-center bg-slate-50 font-sans p-6">
                    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.reset?.title || "Recover Access"}</h2>
                        <p className="text-slate-500 mb-6">{t.reset?.desc || "We'll send a link to your email."}</p>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">{t.emailLabel}</label>
                                <input name="email" type="email" required placeholder="tu@email.com" className="w-full bg-slate-50 border border-slate-200 text-sm p-4 rounded-2xl focus:outline-none focus:border-brand-500 font-medium text-slate-900" />
                            </div>
                            <button type="submit" className="w-full rounded-2xl bg-brand-600 py-4 font-black uppercase tracking-widest text-[11px] text-white hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20">
                                {t.reset?.button || "Send Link"}
                            </button>
                            <button type="button" onClick={() => setIsResetMode(false)} className="w-full text-center text-slate-400 text-sm font-bold hover:text-slate-600 mt-4">
                                {t.reset?.back || "Back"}
                            </button>
                        </form>
                    </div>
                 </div>
            ) : (
                <SignInPage
                    title={
                        isLoginMode 
                            ? t.welcomeHeadline
                            : t.joinHeadline
                    }
                    description={
                        isLoginMode
                            ? t.welcomeSub
                            : t.signupSub
                    }
                    heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
                    testimonials={sampleTestimonials}
                    onSignIn={handleAuth}
                    onLinkedInSignIn={handleSocialLogin}
                    onResetPassword={() => setIsResetMode(true)}
                    onCreateAccount={() => setIsLoginMode(!isLoginMode)}
                    isLoginMode={isLoginMode}
                    // Dynamic Props
                    emailLabel={t.emailLabel}
                    passwordLabel={t.passwordLabel}
                    forgotPasswordLabel={t.forgotPassword}
                    rememberMeLabel={t.rememberMe}
                    loginButtonLabel={t.login}
                    signupButtonLabel={t.register}
                    orContinueLabel={t.continueWith}
                    linkedinButtonLabel={language === "es" ? "Continuar con LinkedIn" : "Continue with LinkedIn"}
                    newHereLabel={t.newHere}
                    alreadyMemberLabel={t.alreadyMember}
                    registerLinkText={t.ctaSignup}
                    loginLinkText={t.ctaLogin}
                    trustBadges={t.trust}
                />
            )}
            
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                </div>
            )}
        </>
    );
};

export default LoginPage;
