import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { APP_DOMAIN } from "../../constants";
import { translations } from "../../translations";
import { AppLanguage, UserProfile } from "../../types";

interface NavbarProps {
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
    user?: UserProfile;
    activeSection: string;
    scrollToSection: (
        e: React.MouseEvent<HTMLAnchorElement>,
        sectionId: string,
    ) => void;
}

const Navbar: React.FC<NavbarProps> = (
    { language, setLanguage, user, activeSection, scrollToSection },
) => {
    const t = translations[language];

    const getNavLinkClass = (id: string) => {
        const isActive = activeSection === id;
        return `px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
            isActive
                ? "text-brand-700 bg-white shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-brand-700 hover:bg-white/50"
        }`;
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div
                    className="flex items-center gap-2 font-display font-bold text-2xl text-slate-900 tracking-tight cursor-pointer group"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-110">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl rotate-6 opacity-50 blur-[2px]">
                        </div>
                        <div className="relative w-full h-full bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                            K
                        </div>
                    </div>
                    <span className="font-display font-bold text-xl text-slate-900 tracking-tight ml-2">
                        Kolink
                    </span>
                </div>

                <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/50 border border-slate-200/50 backdrop-blur-md">
                    <a
                        href="#demo"
                        onClick={(e) => scrollToSection(e, "demo")}
                        className={getNavLinkClass("demo")}
                    >
                        {t.nav.demo}
                    </a>
                    <a
                        href="#tools"
                        onClick={(e) => scrollToSection(e, "tools")}
                        className={getNavLinkClass("tools")}
                    >
                        {t.nav.tools}
                    </a>
                    <a
                        href="#howitworks"
                        onClick={(e) => scrollToSection(e, "howitworks")}
                        className={getNavLinkClass("howitworks")}
                    >
                        {t.nav.howItWorks}
                    </a>
                    <a
                        href="#pricing"
                        onClick={(e) => scrollToSection(e, "pricing")}
                        className={getNavLinkClass("pricing")}
                    >
                        {t.nav.pricing}
                    </a>
                    <a
                        href="#faq"
                        onClick={(e) => scrollToSection(e, "faq")}
                        className={getNavLinkClass("faq")}
                    >
                        {t.nav.faq}
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    {/* Language Toggle */}
                    <button
                        onClick={() =>
                            setLanguage(language === "en" ? "es" : "en")}
                        className="w-10 h-10 rounded-full bg-slate-100 text-lg flex items-center justify-center hover:bg-slate-200 transition-colors border border-slate-200"
                        title="Change Language"
                    >
                        {language === "en" ? "🇺🇸" : "🇪🇸"}
                    </button>

                    {user?.id && !user.id.startsWith("mock-")
                        ? (
                            <Link
                                to="/dashboard"
                                className="group bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 text-sm"
                            >
                                {language === "es"
                                    ? "Ir al Dashboard"
                                    : "Go to Dashboard"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )
                        : (
                            <Link
                                to="/login"
                                className="group bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 text-sm"
                            >
                                {t.nav.login}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
