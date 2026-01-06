import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { APP_DOMAIN } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { useToasts } from "../../ui/toast";
import { Helmet } from "react-helmet-async";
import { useUser } from "../../../context/UserContext";
import { SignInPage, Testimonial } from "../../ui/sign-in";

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
    const toasts = useToasts();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Reset loading state if session is established or component re-mounts
    useEffect(() => {
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
        const password = formData.get('password') as string;

        setIsLoading(true);

        try {
            if (isLoginMode) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
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
                toasts.success(
                    language === "es"
                        ? "Cuenta creada. Por favor verifica tu correo."
                        : "Account created. Please check your email."
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
            toasts.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async () => {
        setIsLoading(true);
        try {
            const redirectTo = `https://${APP_DOMAIN}/dashboard`;
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'linkedin_oidc',
                options: {
                    redirectTo,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            toasts.error(error.message || `Error al iniciar sesión`);
            setIsLoading(false);
        }
    };

    const handleResetPassword = () => {
        toasts.info(
            language === "es"
                ? "Función de recuperación en mantenimiento. Por favor contacta a soporte."
                : "Reset password feature in maintenance. Please contact support."
        );
    };

    return (
        <>
            <Helmet>
                <title>
                    {isLoginMode
                        ? (language === "es" ? "Iniciar Sesión - Kolink" : "Login - Kolink")
                        : (language === "es" ? "Crear Cuenta - Kolink" : "Sign Up - Kolink")}
                </title>
            </Helmet>

            <SignInPage
                title={
                    isLoginMode 
                        ? "Bienvenido de nuevo"
                        : "Crea tu cuenta"
                }
                description={
                    isLoginMode
                        ? "Accede a tu workspace de creación y lleva tu LinkedIn al siguiente nivel."
                        : "Únete a la élite de creadores de contenido asistidos por IA."
                }
                heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
                testimonials={sampleTestimonials}
                onSignIn={handleAuth}
                onLinkedInSignIn={handleSocialLogin}
                onResetPassword={handleResetPassword}
                onCreateAccount={() => setIsLoginMode(!isLoginMode)}
                isLoginMode={isLoginMode}
            />
            
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
