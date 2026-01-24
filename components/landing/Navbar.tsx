import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { APP_DOMAIN } from "../../constants.ts";
import { translations } from "../../translations.ts";
import { AppLanguage, UserProfile } from "../../types.ts";

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
    const t = translations[language as AppLanguage];

    const getNavLinkClass = (id: string) => {
        const isActive = activeSection === id;
        return `px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
            isActive
                ? "text-brand-700 bg-white shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-brand-700 hover:bg-white/50"
        }`;
    };

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 px-4 md:px-0">
            <div className="max-w-fit mx-auto glass border border-slate-200/60 rounded-full pr-1.5 pl-6 py-1.5 flex items-center gap-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-all duration-300">
                <div
                    className="flex items-center gap-2 font-display font-bold text-slate-900 tracking-tight cursor-pointer group"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                        <img
                            src="/logo.png"
                            alt="Kolink Logo"
                            className="w-full h-full object-cover scale-110 rounded-lg shadow-md shadow-brand-500/10"
                        />
                    </div>
                    <span className="font-display font-bold text-lg text-slate-900 tracking-tight ml-1">
                        Kolink
                    </span>
                </div>

                <div className="hidden lg:flex items-center gap-1">
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
                        href="#comparison"
                        onClick={(e) => scrollToSection(e, "comparison")}
                        className={getNavLinkClass("comparison")}
                    >
                        {t.nav.comparison}
                    </a>
                    <a
                        href="#viral-calc"
                        onClick={(e) => scrollToSection(e, "viral-calc")}
                        className={getNavLinkClass("viral-calc")}
                    >
                        {t.nav.viralScore}
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
                    {user?.id && !user.id.startsWith("mock-")
                        ? (
                            <Link
                                to="/dashboard"
                                className="group bg-brand-600 text-white pl-5 pr-4 py-2 rounded-full font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 hover:shadow-nexus hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 text-sm"
                            >
                                Dashboard
                                <div className="p-1 bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </Link>
                        )
                        : (
                            <Link
                                to="/login"
                                className="group bg-brand-600 text-white pl-5 pr-4 py-2 rounded-full font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 hover:shadow-nexus hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 text-sm"
                            >
                                {t.nav.login}
                                <div className="p-1 bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </Link>
                        )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
