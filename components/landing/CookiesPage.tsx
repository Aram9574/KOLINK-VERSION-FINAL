import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppLanguage } from "../../types";

interface CookiesPageProps {
    language: AppLanguage;
}

const CookiesPage: React.FC<CookiesPageProps> = ({ language }) => {
    return (
        <div className="min-h-screen bg-white">
            <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </div>
                            <span className="font-display font-bold text-slate-900">
                                {language === "es"
                                    ? "Volver al inicio"
                                    : "Back to Home"}
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
                <article className="prose prose-slate lg:prose-lg max-w-none">
                    <h1 className="font-display text-4xl font-bold mb-8 text-slate-900">
                        {language === "es"
                            ? "Política de Cookies"
                            : "Cookie Policy"}
                    </h1>

                    <p className="text-slate-500 mb-8">
                        {language === "es"
                            ? "Última actualización: 18 de Diciembre, 2025"
                            : "Last updated: December 18, 2025"}
                    </p>

                    {language === "es"
                        ? (
                            <>
                                <h3>1. ¿Qué son las cookies?</h3>
                                <p>
                                    Las cookies son pequeños archivos de texto
                                    que los sitios web almacenan en su
                                    computadora o dispositivo móvil cuando los
                                    visita. Permiten que el sitio web recuerde
                                    sus acciones y preferencias (como inicio de
                                    sesión, idioma, tamaño de fuente y otras
                                    preferencias de visualización) durante un
                                    período de tiempo.
                                </p>

                                <h3>2. ¿Cómo usamos las cookies?</h3>
                                <p>Utilizamos cookies para:</p>
                                <ul>
                                    <li>
                                        Mantener su sesión iniciada de forma
                                        segura.
                                    </li>
                                    <li>
                                        Recordar sus preferencias de idioma y
                                        configuración.
                                    </li>
                                    <li>
                                        Analizar cómo utiliza nuestra plataforma
                                        para mejorar el rendimiento.
                                    </li>
                                    <li>
                                        Procesar pagos de forma segura a través
                                        de Stripe.
                                    </li>
                                </ul>

                                <h3>3. Tipos de cookies que utilizamos</h3>
                                <p>
                                    <strong>Cookies Esenciales:</strong>{" "}
                                    Necesarias para el funcionamiento del sitio
                                    web. No se pueden desactivar.
                                </p>
                                <p>
                                    <strong>Cookies de Analítica:</strong>{" "}
                                    Nos ayudan a entender cómo interactúan los
                                    visitantes con el sitio web (ej. Google
                                    Analytics).
                                </p>
                                <p>
                                    <strong>Cookies de Funcionalidad:</strong>
                                    {" "}
                                    Permiten recordar sus elecciones (como su
                                    nombre de usuario o idioma).
                                </p>

                                <h3>4. Gestión de cookies</h3>
                                <p>
                                    Puede controlar y/o eliminar las cookies
                                    como desee. Puede eliminar todas las cookies
                                    que ya están en su computadora y puede
                                    configurar la mayoría de los navegadores
                                    para evitar que se coloquen. Sin embargo, si
                                    hace esto, es posible que tenga que ajustar
                                    manualmente algunas preferencias cada vez
                                    que visite un sitio y que algunos servicios
                                    y funcionalidades no funcionen.
                                </p>
                            </>
                        )
                        : (
                            <>
                                <h3>1. What are cookies?</h3>
                                <p>
                                    Cookies are small text files that websites
                                    store on your computer or mobile device when
                                    you visit them. They allow the website to
                                    remember your actions and preferences (such
                                    as login, language, font size, and other
                                    display preferences) over a period of time.
                                </p>

                                <h3>2. How do we use cookies?</h3>
                                <p>We use cookies to:</p>
                                <ul>
                                    <li>Keep you signed in securely.</li>
                                    <li>
                                        Remember your language preferences and
                                        settings.
                                    </li>
                                    <li>
                                        Analyze how you use our platform to
                                        improve performance.
                                    </li>
                                    <li>
                                        Process payments securely via Stripe.
                                    </li>
                                </ul>

                                <h3>3. Types of cookies we use</h3>
                                <p>
                                    <strong>Essential Cookies:</strong>{" "}
                                    Necessary for the website to function.
                                    Cannot be disabled.
                                </p>
                                <p>
                                    <strong>Analytics Cookies:</strong>{" "}
                                    Help us understand how visitors interact
                                    with the website (e.g., Google Analytics).
                                </p>
                                <p>
                                    <strong>Functionality Cookies:</strong>{" "}
                                    Allow us to remember your choices (like
                                    username or language).
                                </p>

                                <h3>4. Cookie Management</h3>
                                <p>
                                    You can control and/or delete cookies as you
                                    wish. You can delete all cookies that are
                                    already on your computer and you can set
                                    most browsers to prevent them from being
                                    placed. If you do this, however, you may
                                    have to manually adjust some preferences
                                    every time you visit a site and some
                                    services and functionalities may not work.
                                </p>
                            </>
                        )}
                </article>
            </main>
        </div>
    );
};

export default CookiesPage;
